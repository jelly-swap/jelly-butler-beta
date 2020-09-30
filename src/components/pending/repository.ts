import Repository from '../../repository';
import { logDebug } from '../../logger';
import { safeAccess } from '../../utils';
import UserConfig from '../../config';
import { PendingModel } from './model';
import { In } from 'typeorm';

export default class PendingRepository {
    private pendingRepository;

    constructor() {
        const userConfig = new UserConfig().getUserConfig();

        const getPendingRepository = safeAccess(Repository, [userConfig.DATABASE.ACTIVE, 'pending']);

        if (!getPendingRepository) {
            throw new Error('REFUND_REPOSITORY_MISSING');
        } else {
            this.pendingRepository = getPendingRepository();
        }
    }

    public async create(withdraw: any) {
        try {
            return this.pendingRepository.save(
                new PendingModel(
                    withdraw.id,
                    withdraw.hashLock,
                    withdraw.secret,
                    withdraw.transactionHash,
                    withdraw.sender,
                    withdraw.receiver,
                    withdraw.network
                )
            );
        } catch (error) {
            logDebug(`WITHDRAW_REPOSITORY_ERROR`, error);
            return error;
        }
    }

    public findManyByIds(ids) {
        return this.pendingRepository.find({ where: { id: In(ids) } });
    }
}
