import { AppConfig } from './controller';

export default [
    {
        method: 'get',
        route: '/api/v1/appConfig',
        controller: AppConfig,
        action: 'getConfig',
    },
    {
        method: 'post',
        route: '/api/v1/appConfig',
        controller: AppConfig,
        action: 'updateConfig',
    },
];
