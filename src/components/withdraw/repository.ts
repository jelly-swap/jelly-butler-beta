import AppConfig from '../../../config';
import Repository from '../../repository';


import { logError } from '../../logger';

export default class WithdrawRepository {
    private withdrawRepository = Repository[AppConfig.ACTIVE_DB]['withdraw']();

    public async create(withdraw: any) {
        try {
            await this.withdrawRepository.save(withdraw);
        } catch (error) {
            logError(`Error while saving the Withdraw: ${error}`);
        }
    }

    public async findByIdAndNetwork(id: string, network: string) {
        return this.withdrawRepository.findOne({ id, network });
    }
}
