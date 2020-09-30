import SwapRepository from './repository';

export class WithdrawService {
    private swapRepository = new SwapRepository();

    public async add(withdraw: any) {
        return this.swapRepository.create(withdraw);
    }

    public async findByIdAndNetwork(id: string, network: string) {
        return this.swapRepository.findByIdAndNetwork(id, network);
    }

    public findManyByIds(findManyByIds) {
        const ids = Object.values(findManyByIds)[0] as string[];
        return this.swapRepository.findManyByIds(ids);
    }
}
