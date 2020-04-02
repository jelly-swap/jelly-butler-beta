import AppConfig from '../../config';

import { createTransport } from 'nodemailer';

import SwapEmail from './templates/swap';
import WithdrawEmail from './templates/withdraw';
import RefundEmail from './templates/refund';
import { logError, logInfo } from '../logger';

export default class EmailService {
    private transport;

    private static Instance: EmailService;

    constructor() {
        if (EmailService.Instance) {
            return EmailService.Instance;
        }

        this.transport = createTransport({
            service: AppConfig.EMAIL.SERVICE,
            auth: { user: AppConfig.EMAIL.USERNAME, pass: AppConfig.EMAIL.PASSWORD },
        });

        EmailService.Instance = this;
    }

    async send(topic, data) {
        if (AppConfig.EMAIL.ENABLED) {
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
            from: AppConfig.EMAIL.FROM,
            to: AppConfig.EMAIL.TO,
            subject: `${AppConfig.EMAIL.SUBJECT} ${title}`,
            text: JSON.stringify(content.json),
            html: content.html,
        };

        await this.transport.sendMail(mailOptions, (err, information) => {
            if (err) {
                logError('EMAIL_ERROR', err);
            } else {
                logInfo('EMAIL_SENT', information.response);
            }
        });
    }
}
