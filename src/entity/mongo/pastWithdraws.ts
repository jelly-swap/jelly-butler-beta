import { Column, Entity, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity('pastWithdraws')
export default class PastWithdraws {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    withdrawnId: string;
}
