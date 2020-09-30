import { PastWithdrawsController } from './controller';

export default [
    {
        method: 'get',
        route: '/api/v1/pastWithdraws',
        controller: PastWithdrawsController,
        action: 'getPast',
    },
    {
        method: 'post',
        route: '/api/v1/pastWithdraws',
        controller: PastWithdrawsController,
        action: 'saveNewId',
    },
];
