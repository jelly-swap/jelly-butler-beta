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
        default: 'theme_dark',
    })
    theme: string;

    @Column({
        default: 0,
    })
    intro: number;
}
