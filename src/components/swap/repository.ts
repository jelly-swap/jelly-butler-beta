import { getMongoRepository } from 'typeorm';
import Swap from '../../entity/swap';

import { logError } from '../../logger';

export default class SwapRepository {
    private swapRepository = getMongoRepository(Swap);

    public async create(swap: Swap) {
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
