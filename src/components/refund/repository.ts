import { getRepository, In } from 'typeorm';

import Refund from '../../entity/sql/refund';
import { logDebug } from '../../logger';
import { RefundModel } from './model';

export default class RefundRepository {
    private refundRepository;

    constructor() {
        this.refundRepository = getRepository(Refund);
    }

    public async create(withdraw: any) {
        try {
            return this.refundRepository.save(
                new RefundModel(
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
        return this.refundRepository.find({ where: { id: In(ids) } });
    }
}
