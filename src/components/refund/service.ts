import RefundRepository from './repository';

export default class RefundService {
    private refundRepository = new RefundRepository();

    public add(refund: any) {
        return this.refundRepository.create(refund);
    }

    public findManyByIds(ids) {
        return this.refundRepository.findManyByIds(ids);
    }
}
