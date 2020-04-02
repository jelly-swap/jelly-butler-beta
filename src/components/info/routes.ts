import { InfoController } from './controller';

export default [
    {
        method: 'get',
        route: '/api/v1/info',
        controller: InfoController,
        action: 'getInfo',
    },
];
