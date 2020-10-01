import PendingRepository from './repository';

export default class PendingService {
    private pendingRepository = new PendingRepository();

    public add(pending: any) {
        return this.pendingRepository.create(pending);
    }

    public findManyByIds(ids) {
        return this.pendingRepository.findManyByIds(ids);
    }
}
