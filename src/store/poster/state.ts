import { atom } from 'jotai';
import { UserAndGameCountResult } from '../../api/types/p12';

export const posterSummaryAtom = atom<UserAndGameCountResult | undefined>(undefined);
