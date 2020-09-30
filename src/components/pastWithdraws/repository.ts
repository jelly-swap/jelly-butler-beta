import Repository from '../../repository';

import { safeAccess } from '../../utils';
import UserConfig from '../../config';

export default class PastWithdrawsRepository {
    private pastWithdraws;

    constructor() {
        const userConfig = new UserConfig().getUserConfig();

        this.pastWithdraws = safeAccess(Repository, [userConfig.DATABASE.ACTIVE, 'pastWithdraws'])();
    }

    getPast() {
        return this.pastWithdraws.find();
    }

    saveNewId({ withdrawnId }) {
        return this.pastWithdraws.save({ withdrawnId });
    }
}
