import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pastWithdraws')
export default class PastWithdraws {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    withdrawnId: string;
}
