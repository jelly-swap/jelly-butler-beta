import SwapRepository from './repository';

export class WithdrawService {
    private swapRepository = new SwapRepository();

    async add(withdraw: any) {
        return await this.swapRepository.create(withdraw);
    }

    async findByIdAndNetwork(id: string, network: string) {
        return await this.swapRepository.findByIdAndNetwork(id, network);
    }
}
