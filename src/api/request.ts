import axios from 'axios';
import { P12_API_PREFIX } from '../constants';

const BaseConfig = {
    baseURL: P12_API_PREFIX,
    timeout: 10000, // 请求超时时间
};
export const instance = axios.create(BaseConfig);

// 响应数据
export type Res<T> = {
    code: number;
    msg: string;
    data: T;
};

/**
 * post 请求
 * @param {string} url - 请求短url
 * @param {Record<string, any>} data 请求数据
 * @returns {Promise<T>} 返回 T 类型数据
 */
export const post = <T>(url: string, data?: Record<string, any>) =>
    instance.post<Res<T>>(url, data).then((res) => res.data.data);
