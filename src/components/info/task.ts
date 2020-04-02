import InfoService from './service';
import Config from '../../../config';

export default class InfoTask {
    public name: string;
    private infoService: InfoService;

    constructor() {
        this.name = 'Info Task';
        this.infoService = new InfoService();
    }

    async start() {
        await this.infoService.update();

        setInterval(async () => {
            await this.infoService.update();
        }, 10 * 1000);

        setInterval(async () => {
            await this.infoService.iAmAlive();
        }, 5 * 1000);
    }
}
