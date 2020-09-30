import PendingRepository from './repository';

export default class PendingService {
    private pendingRepository = new PendingRepository();

    public add(pending: any) {
        return this.pendingRepository.create(pending);
    }

    public findManyByIds(payload) {
        const ids = Object.values(payload)[0] as string[];

        return this.pendingRepository.findManyByIds(ids);
    }
}
