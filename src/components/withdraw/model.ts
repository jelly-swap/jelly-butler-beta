export class WithdrawModel {
    constructor(
        public id: string,
        public hashLock: string,
        public secret: string,
        public transactionHash: string,
        public sender: string,
        public receiver: string,
        public network: string
    ) {
        this.id = id;
        this.hashLock = hashLock;
        this.secret = secret;
        this.transactionHash = transactionHash;
        this.sender = sender;
        this.receiver = receiver;
        this.network = network;
    }
}
