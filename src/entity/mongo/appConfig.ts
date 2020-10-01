import { Column, Entity, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity('appConfig')
export default class AppConfig {
    @ObjectIdColumn()
    public id: ObjectID;

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
