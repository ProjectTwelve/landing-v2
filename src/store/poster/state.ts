import { atom } from 'jotai';
import { P12GameInfo, UserAndGameCountResult } from '../../api/types/p12';

export const posterSummaryAtom = atom<UserAndGameCountResult | undefined>(undefined);
export const premiumListAtom = atom<P12GameInfo[]>([]);
