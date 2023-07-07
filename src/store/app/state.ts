import { atom } from 'jotai';
import { PageType } from '../../pages/app/App.config';

export const lockScrollAtom = atom(false);
export const currentPageAtom = atom<PageType>(PageType.Loading);
export const mobileNavMenuOpenAtom = atom(false);
