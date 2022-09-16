import { post } from '../request';
import { NewInfoType } from './news.type';

export const fetchNewList = () => post<NewInfoType[]>('/et/news/list', {});
