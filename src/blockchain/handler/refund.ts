import Contracts from '../contracts';
import { SECONDARY_NETWORKS } from '../config';

export default class RefundHandler {
    async processRefunds() {
        for (const network of Object.keys(Contracts)) {
            if (!SECONDARY_NETWORKS[network]) {
                await Contracts[network].processRefunds();
            }
        }
    }
}
