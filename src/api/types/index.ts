export * from './mars';

export type Response<T> = {
    code: number;
    message: string;
    data: T;
};
