import { UserAndGameCountResult } from '../types/p12';
import request, { Response } from './request';

export const fetchUserAndGameCount = () =>
    request.post<any, Response<UserAndGameCountResult>>('/arcana/summary/getRegUserAndGameCount');
