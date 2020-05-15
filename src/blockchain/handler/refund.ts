import getContracts from '../contracts';
import { SECONDARY_NETWORKS } from '../config';
import { logInfo } from '../../logger';

export default class RefundHandler {
    async processRefunds() {
        const contracts = getContracts();

        let is_secondary_network_active = false;
        for (const network in contracts) {
            if (is_secondary_network_active && SECONDARY_NETWORKS[network]) {
                logInfo(`Secondary Networks Are Succesfully Refunded - ${network}`);
            } else {
                is_secondary_network_active = !!SECONDARY_NETWORKS[network];
                await contracts[network].processRefunds();
            }
        }
    }
}
