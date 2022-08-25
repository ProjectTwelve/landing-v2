import { get, post } from '../request';
import { NewInfo } from './news.type';

export const fetchNewList = () => post<NewInfo[]>('/et/news/list', {});

export const fetchNewInfo = (newsCode: string) => get<NewInfo>(`/n/d/${newsCode}`);
