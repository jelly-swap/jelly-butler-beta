import { BalanceService } from './service';
import Config from '../../../config';
import UserConfig from '../../config';
import { IUserConfig } from '../../types/UserConfig';

export default class BalanceTask {
    public name: string;
    private balanceService: BalanceService;
    private userConfig: IUserConfig;

    constructor() {
        this.name = 'Balance Task';
        this.balanceService = new BalanceService();
        this.userConfig = new UserConfig().getUserConfig();
    }

    async start() {
        await this.balanceService.update();
        await this.balanceService.saveBalanceHistory();

        setInterval(async () => {
            await this.balanceService.update();
        }, this.userConfig.PRICE.UPDATE_INTERVAL * 1000);

        setInterval(async () => {
            await this.balanceService.saveBalanceHistory();
        }, Config.BALANCE_SNAPSHOT_INTERVAL * 1000);
    }
}
