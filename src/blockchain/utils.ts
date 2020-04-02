export const compareAddress = (a1: string, a2: string) => {
    return a1.toLowerCase() === a2.toLowerCase();
};

export const sleep = (msec: number) => {
    return new Promise(resolve => setTimeout(resolve, msec));
};
