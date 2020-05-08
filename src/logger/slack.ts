import * as SlackHook from 'winston-slack-webhook-transport';
import UserConfig from '../config';
import { safeAccess } from '../utils';

export const getSlackTransport = () => {
    const userConfig = new UserConfig().getUserConfig();

    if (userConfig.NOTIFICATIONS.SLACK.ENABLED) {
        return new SlackHook({
            level: 'error',
            webhookUrl: safeAccess(userConfig, ['NOTIFICATIONS', 'SLACK', 'WEBHOOK_URL']),
        });
    }
};
