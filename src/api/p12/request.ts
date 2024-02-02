import axios from 'axios';
import { P12_API_PREFIX } from '../../constants';

export type Response<T> = {
    code: number;
    message: string;
    data: T;
};

const instance = axios.create({
    baseURL: P12_API_PREFIX,
    timeout: 30_000,
});

// Add response interceptor
instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const { response } = error;
        const { data } = response ?? {};
        return Promise.reject(data);
    },
);

export default instance;
