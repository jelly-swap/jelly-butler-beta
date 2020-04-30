import AppConfig from '../../../config';
import Repository from '../../repository';

import { logError } from '../../logger';
import { safeAccess } from '../../utils';

export default class SwapRepository {
    private swapRepository = Repository[AppConfig.ACTIVE_DB]['swap']();

    constructor() {
        const getSwapRepository = safeAccess(Repository, [AppConfig.ACTIVE_DB, 'swap']);

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
