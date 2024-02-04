import { NewInfoType } from '../types/mars';
import { post } from './request';

export const fetchNewList = () => post<NewInfoType[]>('/et/news/list', {});
