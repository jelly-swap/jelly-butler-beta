import RefundRepository from './repository';

export default class RefundService {
    private refundRepository = new RefundRepository();

    public add(refund: any) {
        return this.refundRepository.create(refund);
    }

    public findManyByIds(body) {
        return this.refundRepository.findManyByIds(body.ids);
    }
}
