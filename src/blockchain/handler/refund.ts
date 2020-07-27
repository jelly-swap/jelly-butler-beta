import { getNetworkContracts } from '../contracts';
import { logInfo, logError, logDebug, logData } from '../../logger';
import EmailService from '../../email';

export default class RefundHandler {
    private emailService: EmailService;

    constructor() {
        this.emailService = new EmailService();
    }

    async processRefunds(expiredSwaps) {
        const contracts = getNetworkContracts();

        for (const swap of expiredSwaps) {
            try {
                const { inputAmount, network, id } = swap;
                const transactionHash = await contracts[network]?.refund(swap);

                logData(`Refund ${inputAmount} ${network}`);
                logInfo(`REFUND ${network}: ID: ${id}, TxHash: ${transactionHash}`);

                if (transactionHash) {
                    await this.emailService.send('REFUND', { ...swap, transactionHash });
                }
            } catch (err) {
                logDebug(`${swap.network}_REFUND_ERROR`, { err, swap });
                logError(`Cannot refund transaction: ${swap.id}`);
            }
        }
    }
}
