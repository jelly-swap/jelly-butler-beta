import AppConfig from '../../../config';
import Repository from '../../repository';

import { logError } from '../../logger';

export default class SwapRepository {
    private swapRepository = Repository[AppConfig.ACTIVE_DB]['swap']();

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
