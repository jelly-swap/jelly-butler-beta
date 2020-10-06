import * as moment from 'moment';

import Validators from './validators';
import AppConfig from '../../config';

import { greaterThan, sub, lessThanOrEqual, mul, divDecimals } from '../utils/math';
import { logError, logDebug, logData } from '../logger';
import { PriceService } from '../components/price/service';
import UserConfig from '../config';
import { safeAccess } from '../utils';
import getBlockchainConfig from './config';
import { compareAddress } from './utils';
import getSupportedNetworks from '../config/supportedNetworks';

export const isInputSwapExpirationValid = (swap) => {
    const blockchainConfig = getBlockchainConfig();
    const now = getCurrentDate(blockchainConfig[swap.network].unix);
    const unixMultiplier = getUnixMultiplier(blockchainConfig[swap.network].unix);
    const result = greaterThan(
        sub(swap.expiration, now),
        mul(blockchainConfig[swap.network].VALID_EXPIRATION, unixMultiplier)
    );

    if (!result) {
        logDebug(`INPUT_INVALID_EXPIRATION`, swap);
    }

    return result;
};

export const isOutputSwapExpirationValid = (swap) => {
    const blockchainConfig = getBlockchainConfig();
    const now = getCurrentDate(blockchainConfig[swap.network].unix);
    const unixMultiplier = getUnixMultiplier(blockchainConfig[swap.network].unix);
    const result = lessThanOrEqual(
        sub(swap.expiration, now),
        mul(blockchainConfig[swap.network].expiration, unixMultiplier)
    );

    if (!result) {
        logDebug(`OUTPUT_INVALID_EXPIRATION`, swap);
    }

    return result;
};

export const isInputSwapValid = async (swap) => {
    const userConfigInstance = new UserConfig();
    const userConfig = userConfigInstance.getUserConfig();
    const blockchainConfig = getBlockchainConfig();
    const inputNetworkValidation = safeAccess(blockchainConfig, [swap.network]);
    const outputNetworkValidation = safeAccess(blockchainConfig, [swap.outputNetwork]);
    const supportedNetworks = getSupportedNetworks();
    const receivers = userConfigInstance.getReceivers(Object.keys(supportedNetworks));

    if (receivers.findIndex((item) => compareAddress(swap.sender, item)) !== -1) {
        logDebug(`INPUT_SENDER_EQUAL_BUTLER_RECEIVER`, swap);
        return false;
    }

    const isPairValid = isInputPairValid(swap);
    if (!isPairValid) {
        logDebug(`INVALID_PAIR`, swap);
        return false;
    }

    if (!isInputSwapExpirationValid(swap)) {
        logDebug(`INPUT_INVALID_EXPIRATION`, swap);
        return false;
    }

    if (!outputNetworkValidation) {
        logDebug(`INPUT_SECONDARY_CHAIN_VALIDATION_FAILED`, swap);
        return false;
    }

    if (!inputNetworkValidation) {
        logDebug(`INPUT_CHAIN_VALIDATION_FAILED`, swap);
        return false;
    }

    if (!compareAddress(swap.receiver, safeAccess(userConfig, ['WALLETS', swap.network, 'ADDRESS']))) {
        logDebug(`INPUT_INVALID_RECEIVER`, swap);
        return false;
    }

    if (!isInputPriceValid(swap)) {
        logDebug(`INPUT_INVALID_PRICE`, swap);
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
        logDebug(`INPUT_CHAIN_VALIDATION_FAILED`, swap);
        return false;
    }

    if (!outputNetworkValidation) {
        logDebug(`OUTPUT_CHAIN_VALIDATION_FAILED`, swap);
        return false;
    }

    if (compareAddress(swap.sender, swap.receiver)) {
        logDebug(`OUTPUT_SENDER_CANNOT_EQUAL_RECEIVER`, swap);
        return false;
    }

    const allowedSlippageAmount = mul(takerDesiredAmount, AppConfig.SLIPPAGE);
    if (greaterThan(sub(takerDesiredAmount, swap.inputAmount), allowedSlippageAmount)) {
        logError(
            `Slippage is too high. Taker requested ${swap.inputAmount} ${swap.network} but the calculated amount is ${takerDesiredAmount}`
        );
        logDebug(`OUTPUT_TOO_HIGH_SLIPPAGE_FOR_TAKER`, swap);
        return false;
    }

    if (!isOutputSwapExpirationValid(swap)) {
        logDebug(`OUTPUT_INVALID_EXPIRATION`, swap);
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

const getUnixMultiplier = (unix) => {
    if (unix) {
        return 1;
    }
    return 1000;
};

function isInputPriceValid(swap) {
    try {
        const priceService = new PriceService();
        const blockchainConfig = getBlockchainConfig();
        const pairPrice = priceService.getPairPriceWithSpreadAndFee(swap.network, swap.outputNetwork);
        logData(`Pair price ${swap.network}-${swap.outputNetwork}: ${pairPrice}`);

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
