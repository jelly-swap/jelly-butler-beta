import { BalanceService } from './service';
import Config from '../../../config';

export default class BalanceTask {
    public name: string;
    private balanceService: BalanceService;

    constructor() {
        this.name = 'Balance Task';
        this.balanceService = new BalanceService();
    }

    async start() {
        await this.balanceService.update();

        setInterval(async () => {
            await this.balanceService.update();
        }, Config.PRICE.UPDATE_INTERVAL * 1000);
    }
}
