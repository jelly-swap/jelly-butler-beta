import { getRepository, getMongoRepository } from 'typeorm';
import Swap from '../entity/sql/swap';
import MongoSwap from '../entity/mongo/swap';

import Withdraw from '../entity/sql/withdraw';
import MongoWithdraw from '../entity/mongo/withdraw';

import Refund from '../entity/sql/refund';
import MongoRefund from '../entity/mongo/refund';

import Balance from '../entity/sql/balance';
import MongoBalance from '../entity/mongo/balance';

import AppConfig from '../entity/sql/appConfig';
import MongoAppConfig from '../entity/mongo/appConfig';

import PastWithdraws from '../entity/sql/pastWithdraws';
import MongoPastWithdraws from '../entity/mongo/pastWithdraws';

export default {
    MONGODB: {
        swap: () => getMongoRepository(MongoSwap),
        withdraw: () => getMongoRepository(MongoWithdraw),
        refund: () => getMongoRepository(MongoRefund),
        balance: () => getMongoRepository(MongoBalance),
        appConfig: () => getMongoRepository(MongoAppConfig),
        pastWithdraws: () => getMongoRepository(MongoPastWithdraws),
    },
    SQLITE: {
        swap: () => getRepository(Swap),
        withdraw: () => getRepository(Withdraw),
        refund: () => getRepository(Refund),
        balance: () => getRepository(Balance),
        appConfig: () => getRepository(AppConfig),
        pastWithdraws: () => getRepository(PastWithdraws),
    },
};
