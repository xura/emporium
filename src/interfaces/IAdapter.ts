export interface IAdapter<T> {
    create(entity: T): Promise<T>;
    find(): Promise<T[]>;
}
