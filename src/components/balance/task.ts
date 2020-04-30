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
        await this.balanceService.saveBalanceHistory();

        setInterval(async () => {
            await this.balanceService.update();
        }, Config.PRICE.UPDATE_INTERVAL * 1000);

        setInterval(async () => {
            await this.balanceService.saveBalanceHistory();
        }, Config.BALANCE_SNAPSHOT_INTERVAL * 1000);
    }
}
