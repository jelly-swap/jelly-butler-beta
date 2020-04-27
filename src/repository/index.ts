import { getRepository, getMongoRepository } from 'typeorm';
import Swap from '../entity/sql/swap';
import MongoSwap from '../entity/mongo/swap';
import Withdraw from '../entity/sql/withdraw';
import MongoWithdraw from '../entity/mongo/withdraw';
import Refund from '../entity/sql/refund';
import MongoRefund from '../entity/mongo/refund';

export default {
    mongodb: {
        swap: () => getMongoRepository(MongoSwap),
        withdraw: () => getMongoRepository(MongoWithdraw),
        refund: () => getMongoRepository(MongoRefund),
    },
    sqlite: {
        swap: () => getRepository(Swap),
        withdraw: () => getRepository(Withdraw),
        refund: () => getRepository(Refund),
    },
};
