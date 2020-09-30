import PastWithdrawsRepository from './repository';

export class PastWithdrawsService {
    private pastWithdraws = new PastWithdrawsRepository();

    async getPast() {
        return this.pastWithdraws.getPast();
    }
}
