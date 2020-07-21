import { getNetworkContracts } from '../contracts';

export default class RefundHandler {
    async processRefunds(expiredSwaps) {
        const contracts = getNetworkContracts();

        for (const swap of expiredSwaps) {
            await contracts[swap.network].processRefunds();
        }
    }
}
