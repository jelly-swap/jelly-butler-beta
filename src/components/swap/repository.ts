import { SwapModel } from './model';
import Repository from '../../repository';

import { logDebug } from '../../logger';
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
