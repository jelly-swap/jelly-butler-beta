import { Column, Index, Entity, UpdateDateColumn, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity('refund')
export default class Refund {
    @ObjectIdColumn()
    public _id: ObjectID;

    @Column()
    @Index({ unique: true })
    swapId: string;

    @Column()
    hashLock: string;

    @Column()
    transactionHash: string;

    @Column()
    sender: string;

    @Column()
    receiver: string;

    @Column()
    network: string;

    @UpdateDateColumn()
    createdAt: Date;

    constructor(
        swapId: string,
        hashLock: string,
        transactionHash: string,
        sender: string,
        receiver: string,
        network: string
    ) {
        this.swapId = swapId;
        this.hashLock = hashLock;
        this.transactionHash = transactionHash;
        this.sender = sender;
        this.receiver = receiver;
        this.network = network;
    }
}
