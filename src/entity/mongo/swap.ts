import { Column, Entity, UpdateDateColumn, Index, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity('swap')
export default class Swap {
    @ObjectIdColumn()
    public _id: ObjectID;

    @Column()
    @Index({ unique: true })
    id: string;

    @Column()
    outputSwapId: string;

    @Column()
    hashLock: string;

    @Column()
    transactionHash: string;

    @Column()
    sender: string;

    @Column()
    receiver: string;

    @Column()
    refundAddress: string;

    @Column()
    outputAddress: string;

    @Column()
    inputAmount: number;

    @Column()
    outputAmount: number;

    @Column()
    expiration: number;

    @Column()
    network: string;

    @Column()
    outputNetwork: string;

    @UpdateDateColumn()
    createdAt: Date;

    constructor(
        id: string,
        outputSwapId: string,
        hashLock: string,
        transactionHash: string,
        sender: string,
        receiver: string,
        refundAddress: string,
        outputAddress: string,
        inputAmount: number,
        outputAmount: number,
        expiration: number,
        network: string,
        outputNetwork: string
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
