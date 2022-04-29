import React, { createContext, useContext, useEffect, useRef } from 'react';
import { PageType } from './App.config';

export const AppContext = createContext<{
    visiblePage: PageType;
    setVisiblePage: (t: PageType) => void;
} | null>(null);

type VisibleHookCallBacks = {
    onDestroy?: () => void;
    onVisible?: () => void;
    onHide?: () => void;
};
export const usePageVisible = function (
    key: PageType,
    effectFun: () => VisibleHookCallBacks | undefined
) {
    const visible = useContext(AppContext)?.visiblePage === key;
    const callbacksRef = useRef<VisibleHookCallBacks | undefined>({});
    useEffect(() => {
        callbacksRef.current = effectFun();

        // TODO 看是否处理
        callbacksRef.current?.onHide?.();

        return () => {
            callbacksRef.current?.onHide?.();
            callbacksRef.current?.onDestroy?.();
        };
    }, []);
    useEffect(() => {
        if (visible) {
            callbacksRef.current?.onVisible?.();
        }
        return callbacksRef.current?.onHide;
    }, [visible]);
};
