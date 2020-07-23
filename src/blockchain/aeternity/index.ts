import { Contract, Providers } from '@jelly-swap/aeternity';

import { greaterThan } from '../../utils/math';

export default class AeternityContract extends Contract {
    constructor(config) {
        super(new Providers.HTTP(config, config.KEY_PAIR), config);
    }

    async userWithdraw(swap, secret) {
        const address = swap.receiver;
        const balance = await super.getBalance(address);
        const isBalanceZero = greaterThan(balance, 0);

        if (!isBalanceZero) {
            const result = await super.withdraw({ ...swap, secret });
            return result;
        }
    }
}
