import { createTransport } from 'nodemailer';

import SwapEmail from './templates/swap';
import WithdrawEmail from './templates/withdraw';
import RefundEmail from './templates/refund';
import { logInfo, logDebug } from '../logger';
import { IUserConfig } from '../types/UserConfig';
import UserConfig from '../config';
import { safeAccess } from '../utils';

export default class EmailService {
    private transport;

    private static Instance: EmailService;

    private userConfig: IUserConfig;

    constructor() {
        if (EmailService.Instance) {
            return EmailService.Instance;
        }

        this.userConfig = new UserConfig().getUserConfig();

        this.transport = createTransport({
            service: safeAccess(this.userConfig, ['NOTIFICATIONS', 'EMAIL', 'SERVICE']),
            auth: {
                user: safeAccess(this.userConfig, ['NOTIFICATIONS', 'EMAIL', 'USERNAME']),
                pass: safeAccess(this.userConfig, ['NOTIFICATIONS', 'EMAIL', 'PASSWORD']),
            },
        });

        EmailService.Instance = this;
    }

    async send(topic, data) {
        if (this.userConfig.NOTIFICATIONS?.EMAIL?.ENABLED) {
            let result;

            switch (topic) {
                case 'SWAP': {
                    result = SwapEmail(data);
                    break;
                }

                case 'WITHDRAW': {
                    result = WithdrawEmail(data);
                    break;
                }

                case 'REFUND': {
                    result = RefundEmail(data);
                    break;
                }
            }

            if (result) {
                await this._send(topic, result);
            }
        }
    }

    private async _send(title, content) {
        const mailOptions = {
            from: safeAccess(this.userConfig, ['NOTIFICATIONS', 'EMAIL', 'FROM']),
            to: safeAccess(this.userConfig, ['NOTIFICATIONS', 'EMAIL', 'TO']),
            subject: `${safeAccess(this.userConfig, ['NOTIFICATIONS', 'EMAIL', 'SUBJECT'])} ${title}`,
            text: JSON.stringify(content.json),
            html: content.html,
        };

        await this.transport.sendMail(mailOptions, (err, information) => {
            if (err) {
                logDebug('EMAIL_ERROR', err);
            } else {
                logInfo('EMAIL_SENT', information.response);
            }
        });
    }
}
