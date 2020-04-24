import { Column, Index, Entity, UpdateDateColumn, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity('withdraw')
export default class Withdraw {
    @ObjectIdColumn()
    public _id: ObjectID;

    @Column()
    @Index({ unique: true })
    id: string;

    @Column()
    hashLock: string;

    @Column()
    secret: string;

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
        id: string,
        hashLock: string,
        secret: string,
        transactionHash: string,
        sender: string,
        receiver: string,
        network: string
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

