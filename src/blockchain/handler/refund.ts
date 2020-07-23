import { getNetworkContracts } from '../contracts';
import { logInfo, logError } from '../../logger';
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
                const transactionHash = await contracts[swap.network]?.refund(swap);

                logInfo(`REFUND ${swap.network}: ID: ${swap.id}, TxHash: ${transactionHash}`);

                if (transactionHash) {
                    await this.emailService.send('REFUND', { ...swap, transactionHash });
                }
            } catch (err) {
                logError(`${swap.network}_REFUND_ERROR`, { err, swap });
            }
        }
    }
}
