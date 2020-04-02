import { WithdrawController } from './controller';

export default [
    {
        method: 'post',
        route: '/api/v1/withdraw',
        controller: WithdrawController,
        action: 'withdraw',
    },
];
