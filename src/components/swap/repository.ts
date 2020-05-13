import AppConfig from '../../../config';
import Repository from '../../repository';

import { logError } from '../../logger';
import { safeAccess } from '../../utils';
import UserConfig from '../../config';

export default class SwapRepository {
    private swapRepository;

    constructor() {
        const userConfig = new UserConfig().getUserConfig();

        const getSwapRepository = safeAccess(Repository, [userConfig.DATABASE.ACTIVE, 'swap']);

        if (!getSwapRepository) {
            throw new Error('SWAP_REPOSITORY_MISSING');
        } else {
            this.swapRepository = getSwapRepository();
        }
    }

    public async create(swap: any) {
        try {
            await this.swapRepository.save(swap);
        } catch (error) {
            logError(`Error while saving the Swap: ${error}`);
        }
    }

    public async findByIdAndNetwork(id: string, network: string) {
        return this.swapRepository.findOne({ id, network });
    }

    public async findInputSwapByOutputSwapIdAndOutputNetwork(outputSwapId: string, outputNetwork: string) {
        return this.swapRepository.findOne({ outputSwapId, outputNetwork });
    }
}
