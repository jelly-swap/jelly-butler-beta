import { Column, Entity, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('balance')
export default class Balance {
    @PrimaryGeneratedColumn()
    public _id: number;

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
    portfolioInDollars: number;

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
        portfolioInDollars: number
    ) {
        this.BTC = BTC;
        this.ETH = ETH;
        this.DAI = DAI;
        this.USDC = USDC;
        this.WBTC = WBTC;
        this.AE = AE;
        this.TRX = TRX;
        this.portfolioInDollars = portfolioInDollars;
    }
}
