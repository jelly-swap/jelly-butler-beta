import getAdapters from '../adapters';
import getContracts from '../contracts';
import { isOutputSwapValid, isInputSwapValid } from '../validator';
import { sleep } from '../utils';

import { logInfo, logWarn, logData, logDebug } from '../../logger';

import { SwapService } from '../../components/swap/service';
import EmailService from '../../email';
import Exchange from '../../exchange';

import { divDecimals, mulDecimals, mul, toFixed } from '../../utils/math';
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

    private localCache: any;

    constructor() {
        this.swapService = new SwapService();
        this.emailService = new EmailService();
        this.exchange = new Exchange();
        this.contracts = getContracts();
        this.adapters = getAdapters();
        this.priceService = new PriceService();
        this.blockchainConfig = getBlockchainConfig();
        this.localCache = {};
    }

    async onSwap(inputSwap, maxTries = RETRY_COUNT) {
        try {
            logInfo(`SWAP_RECEIVED`, inputSwap);

            const isProcessed = await this.swapService.findByIdAndNetwork(inputSwap.id, inputSwap.network);

            if (!isProcessed && !this.localCache[inputSwap.id]) {
                const inputAdapter = this.adapters[inputSwap.network];
                const outputAdapter = this.adapters[inputSwap.outputNetwork];
                const contract = this.contracts[inputSwap.outputNetwork];

                const outputSwap = outputAdapter.createSwapFromInput({
                    ...inputSwap,
                    outputAmount: this.getLatestOutputAmount(inputSwap),
                });

                const validOutputSwap = await isOutputSwapValid(outputSwap, inputSwap.outputAmount);

                const validInputSwap = await isInputSwapValid(inputSwap);

                if (validOutputSwap && validInputSwap) {
                    try {
                        logInfo('SWAP_OUTPUT', outputSwap);

                        this.localCache[inputSwap.id] = true;
                        const result = await contract.newContract(outputSwap);

                        const transactionHash = result.hash || result;

                        try {
                            await this.swapService.add(outputSwap.id, inputSwap);
                            await this.swapService.add(inputSwap.id, { ...outputSwap, transactionHash });

                            this.exchange.placeOrder(inputSwap);

                            logInfo('SWAP_SENT', transactionHash);

                            logData(
                                `Created a swap: ${outputAdapter.parseFromNative(
                                    String(outputSwap.inputAmount),
                                    outputSwap.network
                                )} ${outputSwap.network} for ${inputAdapter.parseFromNative(
                                    String(inputSwap.inputAmount),
                                    inputSwap.network
                                )} ${inputSwap.network}`
                            );

                            await this.emailService.send('SWAP', { ...outputSwap, transactionHash });
                        } catch (err) {
                            logDebug(`SWAP_SERVICE_ERROR: ${err}`);
                        }
                    } catch (err) {
                        this.localCache[inputSwap.id] = false;

                        logDebug('SWAP_BROADCAST_ERROR', inputSwap.id);
                        logDebug(`SWAP_ERROR`, err);
                        if (maxTries > 0) {
                            logInfo('SWAP_RETRY', inputSwap.id);
                            await sleep((RETRY_COUNT + 1 - maxTries) * RETRY_TIME);
                            await this.onSwap(inputSwap, maxTries - 1);
                        } else {
                            logDebug('SWAP_FAILED', inputSwap.id);
                        }
                    }
                }
            } else {
                logWarn('SWAP_ALREADY_PROCESSED', inputSwap.id);
            }
        } catch (err) {
            logDebug(`CANNOT_PREPARE_SWAP_OUTPUT`, { inputSwap, err });
        }
    }

    async processOldSwaps(swaps) {
        logData(`Checking for missed swaps.`);

        if (swaps) {
            for (const swap of swaps) {
                await this.onSwap(swap);
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
