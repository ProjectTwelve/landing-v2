import { P12GameInfo, UserAndGameCountResult } from '../types/p12';
import request, { Response } from './request';

export const fetchUserAndGameCount = () =>
    request.post<any, Response<UserAndGameCountResult>>('/arcana/summary/getRegUserAndGameCount');

export const fetchP12GameRecommendList = () => request.get<any, Response<P12GameInfo[]>>('/arcana/game/recommend');
