import AppConfig from '../../config';
import * as moment from 'moment';

import Validators from './validators';
import Config from './config';

import { greaterThan, sub } from '../utils/math';
import { logError } from '../logger';
import { PriceService } from '../components/price/service';

export const isInputSwapExpirationValid = swap => {
    const now = getCurrentDate(Config[swap.network].unix);
    const result = greaterThan(sub(swap.expiration, now), Config[swap.network].VALID_EXPIRATION);

    if (!result) {
        logError(`INVALID_EXPIRATION`, swap);
    }

    return result;
};

export const isOutputSwapValid = async swap => {
    const networkValidation = await Validators[swap.network].validateNewContract(swap);

    if (!networkValidation) {
        logError(`CHAIN_VALIDATION_FAILED`, swap);
        return false;
    }

    //Add exception for ERC20 Tokens
    if (swap.outputAddress.toLowerCase() === Config[swap.network].receiverAddress.toLowerCase()) {
        logError(`WRONG_OUTPUT_ADDRESS`, swap);
        return false;
    }

    if (swap.sender.toLowerCase() === swap.receiver.toLowerCase()) {
        logError(`SENDER_CANNOT_EQUAL_RECEIVER`, swap);
        return false;
    }

    const isPriceValid = new PriceService().isInputPriceValid(swap);
    if (!isPriceValid) {
        logError(`WRONG_PRICE`, swap);
        return false;
    }

    const isPairValid = isInputPairValid(swap);
    if (!isPairValid) {
        logError(`INVALID_PAIR`, swap);
        return false;
    }

    return true;
};

export const validateWithdraw = async withdraw => {
    const networkValidation = await Validators[withdraw.network].validateWithdraw(withdraw);
    return networkValidation;
};

function isInputPairValid(swap) {
    return AppConfig.PAIRS[`${swap.network}-${swap.outputNetwork}`];
}

const getCurrentDate = unix => {
    const now = moment.now().valueOf();
    if (unix) {
        return Math.floor(now / 1000);
    }
    return now;
};
