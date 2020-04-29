import Adapters from '../adapters';
import Contracts from '../contracts';
import { isOutputSwapValid, isInputSwapExpirationValid } from '../validator';
import { sleep } from '../utils';

import { logInfo, logError } from '../../logger';

import { SwapService } from '../../components/swap/service';
import EmailService from '../../email';
import Exchange from '../../exchange';
import Emitter from '../../emitter';
import { equal } from '../../utils/math';

const RETRY_COUNT = 10;
const RETRY_TIME = 1000 * 10;

export default class SwapHandler {
    private swapService: SwapService;
    private emailService: EmailService;
    private exchange: Exchange;

    constructor() {
        this.swapService = new SwapService();
        this.emailService = new EmailService();
        this.exchange = new Exchange();
    }

    async onSwap(inputSwap, maxTries = RETRY_COUNT) {
        logInfo(`SWAP_RECEIVED`, inputSwap);

        const isProcessed = await this.swapService.findByIdAndNetwork(inputSwap.id, inputSwap.network);

        if (!isProcessed) {
            const adapter = Adapters[inputSwap.outputNetwork];
            const contract = Contracts[inputSwap.outputNetwork];

            const outputSwap = adapter.createSwapFromInput(inputSwap);

            const validOutputSwap = await isOutputSwapValid(outputSwap);

            const validInputSwap = isInputSwapExpirationValid(inputSwap);

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
    }

    async processOldSwaps() {
        logInfo(`TRACK_OLD_SWAPS`);

        const emitter = new Emitter();

        for (const network of Object.keys(Contracts)) {
            try {
                const swaps = await Contracts[network].getPast('new');

                for (const swap of swaps) {
                    // if swap is Active
                    if (equal(swap.status, 1)) {
                        emitter.emit('NEW_CONTRACT', swap);
                    }
                }
            } catch (err) {
                logError(`TRACK_OLD_SWAPS_ERROR ${network} ${err}`);
            }
        }
    }
}
