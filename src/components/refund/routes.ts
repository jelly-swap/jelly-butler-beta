import { RefundController } from './controller';

export default [
    {
        method: 'post',
        route: '/api/v1/refund',
        controller: RefundController,
        action: 'create',
    },
    {
        method: 'post',
        route: '/api/v1/refund/getMany',
        controller: RefundController,
        action: 'findManyByIds',
    },
];
