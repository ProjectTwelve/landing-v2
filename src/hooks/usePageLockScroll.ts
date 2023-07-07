import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { lockScrollAtom } from '../store/app/state';

export const usePageLockScroll = (locked?: boolean) => {
    const setAppLockScroll = useSetAtom(lockScrollAtom);
    useEffect(() => {
        setAppLockScroll?.(!!locked);
    }, [setAppLockScroll, locked]);
};
