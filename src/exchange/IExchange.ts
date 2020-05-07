export default interface IExchange {
    placeOrder(swap): Promise<boolean>;
    getBalance(): any;
    fixPrecision(quote, quantity): any;
}
