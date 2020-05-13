import BigNumber from 'big.js';

export const add = (a, b) => {
    return BigNumber(a).add(b).toString();
};

export const addBig = (a, b) => {
    return BigNumber(a).add(b);
};

export const sub = (a, b) => {
    return BigNumber(a).sub(b).toString();
};

export const mul = (a, b) => {
    return BigNumber(a).times(b).toString();
};

export const mulDecimals = (a, b) => {
    return mul(a, pow(10, b));
};

export const div = (a, b) => {
    return BigNumber(a).div(b);
};

export const pow = (a, b) => {
    return BigNumber(a).pow(b);
};

export const sqrt = (a) => {
    return BigNumber(a).sqrt();
};

export const round = (a, precision) => {
    return BigNumber(a).round(precision);
};

export const greaterThan = (a, b) => {
    return BigNumber(a).gt(b);
};

export const lessThanOrEqual = (a, b) => {
    return BigNumber(a).lte(b);
};

export const equal = (a, b) => {
    return BigNumber(a).eq(b);
};

export const toFixed = (a, precision) => {
    return BigNumber(a).toFixed(precision);
};

export const toBigNumber = (a) => {
    return BigNumber(a);
};

export const divDecimals = (a, b) => {
    return div(a, pow(10, b));
};
