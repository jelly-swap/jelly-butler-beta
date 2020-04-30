import { Column, Entity, UpdateDateColumn, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity('balance')
export default class Balance {
    @ObjectIdColumn()
    public _id: ObjectID;

    @Column()
    BTC: number;

    @Column()
    ETH: number;

    @Column()
    DAI: number;

    @Column()
    USDC: number;

    @Column()
    AE: number;

    @Column()
    WBTC: number;

    @Column()
    TRX: number;

    @Column()
    portfolioInUsdc: number;

    @UpdateDateColumn()
    createdAt: Date;

    constructor(
        BTC: number,
        ETH: number,
        DAI: number,
        USDC: number,
        WBTC: number,
        AE: number,
        TRX: number,
        portfolioInUsdc: number
    ) {
        this.BTC = BTC;
        this.ETH = ETH;
        this.DAI = DAI;
        this.USDC = USDC;
        this.WBTC = WBTC;
        this.AE = AE;
        this.TRX = TRX;
        this.portfolioInUsdc = portfolioInUsdc;
    }
}
