export class SwapModel {
    constructor(
        public id: string,
        public outputSwapId: string,
        public hashLock: string,
        public transactionHash: string,
        public sender: string,
        public receiver: string,
        public refundAddress: string,
        public outputAddress: string,
        public inputAmount: number,
        public outputAmount: number,
        public expiration: number,
        public network: string,
        public outputNetwork: string
    ) {
        this.id = id;
        this.outputSwapId = outputSwapId;
        this.hashLock = hashLock;
        this.transactionHash = transactionHash;
        this.sender = sender;
        this.receiver = receiver;
        this.refundAddress = refundAddress;
        this.outputAddress = outputAddress;
        this.inputAmount = inputAmount;
        this.outputAmount = outputAmount;
        this.expiration = expiration;
        this.network = network;
        this.outputNetwork = outputNetwork;
    }
}
