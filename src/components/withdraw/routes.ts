import { WithdrawController } from './controller';

export default [
    {
        method: 'post',
        route: '/api/v1/withdraw',
        controller: WithdrawController,
        action: 'withdraw',
    },
    {
        method: 'post',
        route: '/api/v1/withdraw/new',
        controller: WithdrawController,
        action: 'newWithdraw',
    },
    {
        method: 'post',
        route: '/api/v1/withdraw/getMany',
        controller: WithdrawController,
        action: 'findManyByIds',
    },
];
