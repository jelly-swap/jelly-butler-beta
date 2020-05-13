import { PriceService } from './service';
import Config from '../../../config';
import UserConfig from '../../config';
import { IUserConfig } from '../../types/UserConfig';

export default class PriceTask {
    public name: string;
    private priceService: PriceService;
    private userConfig: IUserConfig;

    constructor() {
        this.name = 'Price Task';
        this.priceService = new PriceService();
        this.userConfig = new UserConfig().getUserConfig();        
    }

    async start() {
        await this.priceService.update();

        setInterval(async () => {
            await this.priceService.update();
        }, this.userConfig.PRICE.UPDATE_INTERVAL * 1000);
    }
}
