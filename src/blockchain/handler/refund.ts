import getContracts from '../contracts';
import { SECONDARY_NETWORKS } from '../config';

export default class RefundHandler {
    async processRefunds() {
        const contracts = getContracts();

        for (const network of Object.keys(contracts)) {
            if (!SECONDARY_NETWORKS[network]) {
                await contracts[network].processRefunds();
            }
        }
    }
}
