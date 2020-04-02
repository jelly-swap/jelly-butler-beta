import SwapRepository from './repository';

export class SwapService {
    private swapRepository = new SwapRepository();

    async add(outputSwapId: string, swap: any) {
        return await this.swapRepository.create({ ...swap, outputSwapId });
    }

    async findByIdAndNetwork(id: string, network: string) {
        return await this.swapRepository.findByIdAndNetwork(id, network);
    }

    async findInputSwapByOutputSwapIdAndOutputNetwork(outputSwapId: string, outputNetwork: string) {
        return await this.swapRepository.findInputSwapByOutputSwapIdAndOutputNetwork(outputSwapId, outputNetwork);
    }
}
