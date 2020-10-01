import { PendingController } from './controller';

export default [
    {
        method: 'post',
        route: '/api/v1/pending',
        controller: PendingController,
        action: 'create',
    },
    {
        method: 'post',
        route: '/api/v1/pending/getMany',
        controller: PendingController,
        action: 'findManyByIds',
    },
];
