import { PriceService } from './service';
import Config from '../../../config';

export default class PriceTask {
    public name: string;
    private priceService: PriceService;

    constructor() {
        this.name = 'Price Task';
        this.priceService = new PriceService();
    }

    async start() {
        await this.priceService.update();

        setInterval(async () => {
            await this.priceService.update();
        }, Config.PRICE.UPDATE_INTERVAL * 1000);
    }
}
