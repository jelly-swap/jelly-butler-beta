import getAdapters from '../adapters';
import getContracts from '../contracts';
import { SECONDARY_NETWORKS } from '../config';
import { isOutputSwapValid, isInputSwapValid } from '../validator';
import { sleep } from '../utils';

import { logInfo, logError } from '../../logger';

import { SwapService } from '../../components/swap/service';
import EmailService from '../../email';
import Exchange from '../../exchange';
import Emitter from '../../emitter';
import { equal, divDecimals, mulDecimals, mul, toFixed } from '../../utils/math';
import { PriceService } from '../../components/price/service';
import getBlockchainConfig from '../config';

const RETRY_COUNT = 10;
const RETRY_TIME = 1000 * 10;

export default class SwapHandler {
    private swapService: SwapService;
    private emailService: EmailService;
    private exchange: Exchange;

    private contracts: any;
    private adapters: any;
    private priceService: PriceService;
    private blockchainConfig: any;

    constructor() {
        this.swapService = new SwapService();
        this.emailService = new EmailService();
        this.exchange = new Exchange();
        this.contracts = getContracts();
        this.adapters = getAdapters();
        this.priceService = new PriceService();
        this.blockchainConfig = getBlockchainConfig();
    }

    async onSwap(inputSwap, maxTries = RETRY_COUNT) {
        try {    
            logInfo(`SWAP_RECEIVED`, inputSwap);

            const isProcessed = await this.swapService.findByIdAndNetwork(inputSwap.id, inputSwap.network);

            if (!isProcessed) {
                const adapter = this.adapters[inputSwap.outputNetwork];
                const contract = this.contracts[inputSwap.outputNetwork];

                const outputSwap = adapter.createSwapFromInput(
                    {...inputSwap, outputAmount: this.getLatestOutputAmount(inputSwap)}
                );
                console.log('outputSwap - input amount ');
                console.log(outputSwap.inputAmount);

                console.log('adapter here')
                console.log(adapter);

                console.log('outputswap here');
                console.log(outputSwap);

                const validOutputSwap = await isOutputSwapValid(outputSwap, inputSwap.outputAmount);

                const validInputSwap = await isInputSwapValid(inputSwap);

                if (validOutputSwap && validInputSwap) {
                    try {
                        logInfo('SWAP_OUTPUT', outputSwap);

                        const result = await contract.newContract(outputSwap);
                        const transactionHash = result.hash || result;

                        await this.swapService.add(outputSwap.id, inputSwap);
                        await this.swapService.add(inputSwap.id, { ...outputSwap, transactionHash });

                        this.exchange.placeOrder(inputSwap);

                        logInfo('SWAP_SENT', transactionHash);

                        await this.emailService.send('SWAP', { ...outputSwap, transactionHash });
                    } catch (err) {
                        logError('SWAP_BROADCAST_ERROR', inputSwap.id);
                        logError(`SWAP_ERROR: ${err}`);
                        if (maxTries > 0) {
                            logInfo('SWAP_RETRY', inputSwap.id);
                            await sleep((RETRY_COUNT + 1 - maxTries) * RETRY_TIME);
                            await this.onSwap(inputSwap, maxTries - 1);
                        } else {
                            logError('SWAP_FAILED', inputSwap.id);
                        }
                    }
                }
            } else {
                logInfo('SWAP_ALREADY_PROCESSED', inputSwap.id);
            }
        } catch(err) {
          logError(`CANNOT_PREPARE_SWAP_OUTPUT ${inputSwap} ${err}`);
        }
    }

    async processOldSwaps() {
        logInfo(`TRACK_OLD_SWAPS`);

        const emitter = new Emitter();

        let is_secondary_network_active = false;
        for (const network in this.contracts) {
            if(is_secondary_network_active && SECONDARY_NETWORKS[network]) {
                logInfo(`Secondary Networks Swaps Are Succesfully Executed - ${network}`);
            } else {
                try {
                    is_secondary_network_active = !!SECONDARY_NETWORKS[network];
                    const swaps = await this.contracts[network].getPast('new');

                    if (swaps) {
                        for (const swap of swaps) {
                            // if swap is Active
                            if (equal(swap.status, 1)) {
                                emitter.emit('NEW_CONTRACT', swap);
                            }
                        }
                    }
                } catch (err) {
                    logError(`TRACK_OLD_SWAPS_ERROR ${network} ${err}`);
                }
            }
        }
    }

    getLatestOutputAmount(swap) {
        try {
            const pairPrice = this.priceService.getPairPriceWithSpreadAndFee(swap.network, swap.outputNetwork);

            const inputDecimals = this.blockchainConfig[swap.network].decimals;
            const outputDecimals = this.blockchainConfig[swap.outputNetwork].decimals;

            const receivedAmountSlashed = divDecimals(swap.inputAmount, inputDecimals);

            const sendAmountSlashed = mul(receivedAmountSlashed, pairPrice);

            const sendAmountBig = mulDecimals(sendAmountSlashed, outputDecimals);

            return toFixed(sendAmountBig, 0);
        } catch (err) {
            throw new Error('CANNOT_GET_LATEST_INPUT_AMOUNT');
        }   
    }
}
