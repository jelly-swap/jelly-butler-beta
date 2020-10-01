import { Column, Index, Entity, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('refund')
export default class Refund {
    @PrimaryGeneratedColumn()
    public _id: number;

    @Column()
    @Index({ unique: true })
    id: string;

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
        id: string,
        hashLock: string,
        transactionHash: string,
        sender: string,
        receiver: string,
        network: string
    ) {
        this.id = id;
        this.hashLock = hashLock;
        this.transactionHash = transactionHash;
        this.sender = sender;
        this.receiver = receiver;
        this.network = network;
    }
}
