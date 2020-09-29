import { SoundController } from './controller';

export default [
    {
        method: 'get',
        route: '/api/v1/sound',
        controller: SoundController,
        action: 'getSound',
    },
    {
        method: 'post',
        route: '/api/v1/sound',
        controller: SoundController,
        action: 'setSound',
    },
];
