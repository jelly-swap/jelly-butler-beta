import { Column, Entity, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity('appConfig')
export default class AppConfig {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    sound: boolean;

    @Column()
    language: string;

    @Column()
    theme: string;
}
