import { getRepository, getMongoRepository } from 'typeorm';
import Swap from '../entity/sql/swap';
import MongoSwap from '../entity/mongo/swap';
import Withdraw from '../entity/sql/withdraw';
import MongoWithdraw from '../entity/mongo/withdraw';
import Refund from '../entity/sql/refund';
import MongoRefund from '../entity/mongo/refund';

export default {
    mongodb: {
        swap: getMongoSwapRepository,
        withdraw: getMongoWithdrawRepository,
        refund: getMongoRefundRepository,
    },
    sqlite: {
        swap: getSwapRepository,
        withdraw: getWithdrawRepository,
        refund: getRefundRepository,
    },
};

function getMongoSwapRepository(){
    return getMongoRepository(MongoSwap);
}

function getMongoWithdrawRepository() {
    return getMongoRepository(MongoWithdraw);
}

function getMongoRefundRepository() {
    return getMongoRepository(MongoRefund);
}

function getSwapRepository() {
    return getRepository(Swap);
}

function getWithdrawRepository() {
    return getRepository(Withdraw);
}

function getRefundRepository() {
    return getRepository(Refund);
}
