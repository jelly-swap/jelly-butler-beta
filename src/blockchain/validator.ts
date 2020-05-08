import * as moment from 'moment';

import Validators from './validators';
import Config from './config';
import AppConfig from '../../config';

import { greaterThan, sub, lessThanOrEqual, mul } from '../utils/math';
import { logError } from '../logger';
import { PriceService } from '../components/price/service';
import UserConfig from '../config';
import { safeAccess } from '../utils';

export const isInputSwapExpirationValid = (swap) => {
    const now = getCurrentDate(Config[swap.network].unix);
    const result = greaterThan(sub(swap.expiration, now), Config[swap.network].VALID_EXPIRATION);

    if (!result) {
        logError(`INPUT_INVALID_EXPIRATION`, swap);
    }

    return result;
};

export const isOutputSwapExpirationValid = (swap) => {
    const now = getCurrentDate(Config[swap.network].unix);
    const result = lessThanOrEqual(sub(swap.expiration, now), Config[swap.network].expiration);

    if (!result) {
        logError(`OUTPUT_INVALID_EXPIRATION`, swap);
    }

    return result;
};

export const isInputSwapValid = async (swap) => {
    const priceService = new PriceService();
    const inputNetworkValidation = await Validators[swap.network].validateNewContract(swap);
    const outputNetworkValidation = await Validators[swap.outputNetwork].validateNewContract(swap);

    //Expiration time check
    if (!isInputSwapExpirationValid(swap)) {
        logError(`INPUT_INVALID_EXPIRATION`, swap);
        return false;
    }

    //Output network check
    if (!outputNetworkValidation) {
        logError(`INPUT_SECONDARY_CHAIN_VALIDATION_FAILED`, swap);
        return false;
    }

    //Input network check
    if (!inputNetworkValidation) {
        logError(`INPUT_CHAIN_VALIDATION_FAILED`, swap);
        return false;
    }

    //Receiver address check
    if (swap.receiver.toLowerCase() != safeAccess(Config, [swap.network, 'receiverAddress']).toLowerCase()) {
        logError(`INPUT_INVALID_RECEIVER`, swap);
        return false;
    }

    //input price validation
    if(!priceService.isInputPriceValid(swap)){
        logError(`INPUT_INVALID_PRICE`, swap);
        return false;
    }

    return true;
};

export const isOutputSwapValid = async (swap, takerDesiredAmount) => {
    const inputNetworkValidation = await Validators[swap.network].validateNewContract(swap);
    const outputNetworkValidation = await Validators[swap.outputNetwork].validateNewContract(swap);

    //Input network check
    if (!inputNetworkValidation) {
        logError(`INPUT_CHAIN_VALIDATION_FAILED`, swap);
        return false;
    }

    //Output network check
    if (!outputNetworkValidation) {
        logError(`OUTPUT_CHAIN_VALIDATION_FAILED`, swap);
        return false;
    }

    //Add exception for ERC20 Tokens
    if (swap.outputAddress.toLowerCase() === Config[swap.network].receiverAddress.toLowerCase()) {
        logError(`OUTPUT_WRONG_OUTPUT_ADDRESS`, swap);
        return false;
    }

    //Sender and receiver check
    if (swap.sender.toLowerCase() === swap.receiver.toLowerCase()) {
        logError(`OUTPUT_SENDER_CANNOT_EQUAL_RECEIVER`, swap);
        return false;
    }

    //Pair validation
    const isPairValid = isInputPairValid(swap);
    if (!isPairValid) {
        logError(`OUTPUT_INVALID_PAIR`, swap);
        return false;
    }

    //Price validation
    const allowedSlippageAmount = mul(takerDesiredAmount, AppConfig.SLIPPAGE);
    if(greaterThan(sub(takerDesiredAmount, swap.inputAmount), allowedSlippageAmount) ){
        logError(`OUTPUT_TOO_HIGH_SLIPPAGE_FOR_TAKER`, swap);
        return false;
    }

    //Validate expiration
    if(!isOutputSwapExpirationValid(swap)){
        logError(`OUTPUT_INVALID_EXPIRATION`, swap);
        return false;
    }

    return true;
};

export const validateWithdraw = async (withdraw) => {
    const networkValidation = await Validators[withdraw.network].validateWithdraw(withdraw);
    return networkValidation;
};

function isInputPairValid(swap) {
    const userConfig = new UserConfig().getUserConfig();
    const pair = safeAccess(userConfig, ['PAIRS', `${swap.network}-${swap.outputNetwork}`]);

    if (pair) {
        return true;
    }

    return false;
}

const getCurrentDate = (unix) => {
    const now = moment.now().valueOf();
    if (unix) {
        return Math.floor(now / 1000);
    }
    return now;
};
