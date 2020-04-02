import * as SlackHook from 'winston-slack-webhook-transport';
import Config from '../../config';

export const getSlackTransport = () => {
    if (Config.SLACK_WEBHOOK_URL) {
        return new SlackHook({
            level: 'error',
            webhookUrl: Config.SLACK_WEBHOOK_URL,
        });
    }
};
