export class StoreEntityCommand<T> {
    entity: T;
    userId: string;

    constructor(entity: T, userId: string) {
        this.entity = entity;
        this.userId = userId;
    }
}
