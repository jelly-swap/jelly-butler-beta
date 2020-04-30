import { Column, Entity, UpdateDateColumn, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity('balance')
export default class Balance {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    assetName: string;

    @Column()
    amount: number;

    @Column()
    valueInUsdc: number;

    @UpdateDateColumn()
    createdAt: Date;

    constructor(assetName: string, amount: number, valueInUsdc: number) {
        this.assetName = assetName;
        this.amount = amount;
        this.valueInUsdc = valueInUsdc;
    }
}
