export interface EventSwap {
    network: string;
    transactionHash: string;
    blockNumber: number;
    inputAmount: string;
    outputAmount: string;
    expiration: number;
    id: string;
    hashLock: string;
    sender: string;
    receiver: string;
    outputNetwork: string;
    outputAddress: string;
    refundAddress: string;
    status: number;
}
