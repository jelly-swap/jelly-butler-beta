import RefundRepository from './repository';

export default class RefundService {
    private refundRepository = new RefundRepository();

    public add(refund: any) {
        return this.refundRepository.create(refund);
    }

    public findManyByIds(payload) {
        const ids = Object.values(payload)[0] as string[];

        return this.refundRepository.findManyByIds(ids);
    }
}
