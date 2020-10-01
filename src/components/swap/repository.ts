import { getRepository } from 'typeorm';

import Swap from '../../entity/sql/swap';
import { SwapModel } from './model';
import { logDebug } from '../../logger';

export default class SwapRepository {
    private swapRepository;

    constructor() {
        this.swapRepository = getRepository(Swap);
    }

    public async create(swap: any) {
        try {
            await this.swapRepository.save(
                new SwapModel(
                    swap.id,
                    swap.outputSwapId,
                    swap.hashLock,
                    swap.transactionHash,
                    swap.sender,
                    swap.receiver,
                    swap.refundAddress,
                    swap.outputAddress,
                    swap.inputAmount,
                    swap.outputAmount,
                    swap.expiration,
                    swap.network,
                    swap.outputNetwork
                )
            );
        } catch (error) {
            logDebug(`SWAP_REPOSITORY_ERROR`, error);
        }
    }

    public async findByIdAndNetwork(id: string, network: string) {
        return this.swapRepository.findOne({ id, network });
    }

    public async findInputSwapByOutputSwapIdAndOutputNetwork(outputSwapId: string, outputNetwork: string) {
        return this.swapRepository.findOne({ outputSwapId, outputNetwork });
    }
}
