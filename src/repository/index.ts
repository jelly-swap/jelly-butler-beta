import { getRepository } from 'typeorm';

import Swap from '../entity/sql/swap';

import Withdraw from '../entity/sql/withdraw';

import Refund from '../entity/sql/refund';

import Balance from '../entity/sql/balance';

import AppConfig from '../entity/sql/appConfig';
import MongoAppConfig from '../entity/mongo/appConfig';

import Pending from '../entity/sql/pending';

export default {
    SQLITE: {
        swap: () => getRepository(Swap),
        withdraw: () => getRepository(Withdraw),
        refund: () => getRepository(Refund),
        balance: () => getRepository(Balance),
        pending: () => getRepository(Pending),
        appConfig: () => getRepository(AppConfig),
    },
};
