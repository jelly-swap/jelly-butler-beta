import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('appConfig')
export default class AppConfig {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    sound: boolean;

    @Column()
    language: string;

    @Column()
    theme: string;
}
