export default interface IExchange {
    placeOrder(swap): Promise<boolean>;
    getBalance(): any;
}
