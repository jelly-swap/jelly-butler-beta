import { getNetworkContracts } from '../contracts';

export default class RefundHandler {
    async processRefunds() {
        const contracts = getNetworkContracts();

        for (const network in contracts) {
            await contracts[network].processRefunds();
        }
    }
}
