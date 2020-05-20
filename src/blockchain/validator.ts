import * as moment from 'moment';

import Validators from './validators';
import AppConfig from '../../config';

import { greaterThan, sub, lessThanOrEqual, mul, divDecimals } from '../utils/math';
import { logError } from '../logger';
import { PriceService } from '../components/price/service';
import UserConfig from '../config';
import { safeAccess } from '../utils';
import getBlockchainConfig from './config';
import { compareAddress } from './utils';

export const isInputSwapExpirationValid = (swap) => {
    const blockchainConfig = getBlockchainConfig();
    const now = getCurrentDate(blockchainConfig[swap.network].unix);
    const result = greaterThan(sub(swap.expiration, now), blockchainConfig[swap.network].VALID_EXPIRATION);

    if (!result) {
        logError(`INPUT_INVALID_EXPIRATION`, swap);
    }

    return result;
};

export const isOutputSwapExpirationValid = (swap) => {
    const blockchainConfig = getBlockchainConfig();
    const now = getCurrentDate(blockchainConfig[swap.network].unix);
    const result = lessThanOrEqual(sub(swap.expiration, now), blockchainConfig[swap.network].expiration);

    if (!result) {
        logError(`OUTPUT_INVALID_EXPIRATION`, swap);
    }

    return result;
};

export const isInputSwapValid = async (swap) => {
    const userConfig = new UserConfig().getUserConfig();
    const blockchainConfig = getBlockchainConfig();
    const inputNetworkValidation = safeAccess(blockchainConfig, [swap.network]);
    const outputNetworkValidation = safeAccess(blockchainConfig, [swap.outputNetwork]);

    if (!isInputSwapExpirationValid(swap)) {
        logError(`INPUT_INVALID_EXPIRATION`, swap);
        return false;
    }

    if (!outputNetworkValidation) {
        logError(`INPUT_SECONDARY_CHAIN_VALIDATION_FAILED`, swap);
        return false;
    }

    if (!inputNetworkValidation) {
        logError(`INPUT_CHAIN_VALIDATION_FAILED`, swap);
        return false;
    }

    if (compareAddress(swap.receiver, safeAccess(userConfig, ['WALLETS', swap.network, 'ADDRESS']))) {
        logError(`INPUT_INVALID_RECEIVER`, swap);
        return false;
    }

    if (!isInputPriceValid(swap)) {
        logError(`INPUT_INVALID_PRICE`, swap);
        return false;
    }

    return true;
};

export const isOutputSwapValid = async (swap, takerDesiredAmount) => {
    const userConfig = new UserConfig().getUserConfig();
    const blockchainConfig = getBlockchainConfig();
    const inputNetworkValidation = safeAccess(blockchainConfig, [swap.network]);
    const outputNetworkValidation = safeAccess(blockchainConfig, [swap.outputNetwork]);

    if (!inputNetworkValidation) {
        logError(`INPUT_CHAIN_VALIDATION_FAILED`, swap);
        return false;
    }

    if (!outputNetworkValidation) {
        logError(`OUTPUT_CHAIN_VALIDATION_FAILED`, swap);
        return false;
    }

    if (compareAddress(swap.outputAddress, safeAccess(userConfig, ['WALLETS', swap.network, 'ADDRESS']))) {
        logError(`OUTPUT_WRONG_OUTPUT_ADDRESS`, swap);
        return false;
    }

    if (compareAddress(swap.sender, swap.receiver)) {
        logError(`OUTPUT_SENDER_CANNOT_EQUAL_RECEIVER`, swap);
        return false;
    }

    const isPairValid = isInputPairValid(swap);
    if (!isPairValid) {
        logError(`OUTPUT_INVALID_PAIR`, swap);
        return false;
    }

    const allowedSlippageAmount = mul(takerDesiredAmount, AppConfig.SLIPPAGE);
    if (greaterThan(sub(takerDesiredAmount, swap.inputAmount), allowedSlippageAmount)) {
        logError(`OUTPUT_TOO_HIGH_SLIPPAGE_FOR_TAKER`, swap);
        return false;
    }

    if (!isOutputSwapExpirationValid(swap)) {
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

function isInputPriceValid(swap) {
    try {
        const priceService = new PriceService();
        const blockchainConfig = getBlockchainConfig();
        const pairPrice = priceService.getPairPriceWithSpreadAndFee(swap.network, swap.outputNetwork);

        const inputDecimals = blockchainConfig[swap.network].decimals;
        const outputDecimals = blockchainConfig[swap.outputNetwork].decimals;

        const lockedAmountSlashed = divDecimals(swap.inputAmount, inputDecimals);

        const desiredAmountSlashed = divDecimals(swap.outputAmount, outputDecimals);

        const marketActualPrice = mul(lockedAmountSlashed, pairPrice);

        const maxAllowedSlippage = mul(marketActualPrice, AppConfig.SLIPPAGE);

        return greaterThan(maxAllowedSlippage, sub(desiredAmountSlashed, marketActualPrice));
    } catch (err) {
        return false;
    }
}
