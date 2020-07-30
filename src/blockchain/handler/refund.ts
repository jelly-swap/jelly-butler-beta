import getContracts from '../contracts';
import getAdapters from '../adapters';
import { logInfo, logError, logDebug, logData } from '../../logger';
import EmailService from '../../email';

export default class RefundHandler {
    private emailService: EmailService;

    private contracts: any;
    private adapters: any;

    private localCache: any;

    constructor() {
        this.emailService = new EmailService();

        this.contracts = getContracts();
        this.adapters = getAdapters();

        this.localCache = {};
    }

    async processRefunds(expiredSwaps) {
        for (const swap of expiredSwaps) {
            try {
                const { inputAmount, network, id } = swap;

                if (!this.localCache[id]) {
                    const contract = this.contracts[network];

                    const transactionHash = await contract?.refund(swap);

                    this.localCache[id] = true;

                    logData(
                        `Refund ${this.adapters[network].parseFromNative(String(inputAmount), network)} ${network}`
                    );
                    logInfo(`REFUND ${network}: ID: ${id}, TxHash: ${transactionHash}`);

                    if (transactionHash) {
                        await this.emailService.send('REFUND', { ...swap, transactionHash });
                    }
                }
            } catch (err) {
                logDebug(`${swap.network}_REFUND_ERROR ${err}`, { err, swap });
                logError(`Cannot refund transaction: ${swap.id}`);
            }
        }
    }
}
