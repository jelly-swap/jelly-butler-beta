import * as SlackHook from 'winston-slack-webhook-transport';
import UserConfig from '../config';

export const getSlackTransport = () => {
    const userConfig = new UserConfig().getUserConfig();

    if (userConfig.NOTIFICATIONS.SLACK.ENABLED) {
        return new SlackHook({
            level: 'error',
            webhookUrl: userConfig.NOTIFICATIONS.SLACK.WEBHOOK_URL,
        });
    }
};
