import SwapRepository from './repository';

export class WithdrawService {
    private swapRepository = new SwapRepository();

    public async add(withdraw: any) {
        return this.swapRepository.create(withdraw);
    }

    public async findByIdAndNetwork(id: string, network: string) {
        return this.swapRepository.findByIdAndNetwork(id, network);
    }

    public findManyByIds(body) {
        return this.swapRepository.findManyByIds(body.ids);
    }
}
