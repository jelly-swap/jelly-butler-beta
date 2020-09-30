import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('appConfig')
export default class AppConfig {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        default: true,
    })
    sound: boolean;

    @Column({
        default: 'english',
    })
    language: string;

    @Column({
        default: 'dark_theme',
    })
    theme: string;
}
