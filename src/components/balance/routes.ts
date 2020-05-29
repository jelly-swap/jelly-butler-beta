import { BalanceController } from './controller';

export default [
    {
        method: 'get',
        route: '/api/v1/balance',
        controller: BalanceController,
        action: 'getBalances',
    },
    {
        method: 'get',
        route: '/api/v1/balanceAll',
        controller: BalanceController,
        action: 'getAllBalances',
    },
];
