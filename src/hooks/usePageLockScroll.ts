import { useContext, useEffect, useLayoutEffect } from 'react';
import { AppContext } from '../pages/app/App.utils';

export const usePageLockScroll = (locked?: boolean) => {
    const setAppLock = useContext(AppContext)?.setLockScroll;
    useEffect(() => {
        if (!setAppLock) return;
        setAppLock(!!locked);
    }, [setAppLock, locked]);
};
