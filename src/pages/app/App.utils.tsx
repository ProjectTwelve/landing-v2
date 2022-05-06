import React, { createContext, useContext, useEffect, useRef } from 'react';
import { PageType } from './App.config';
import EE from 'eventemitter3';
import { mapValues, mean, pick } from 'lodash-es';

interface AppContextValue {
    visiblePage: PageType;
    setVisiblePage: (t: PageType) => void;
}
export const AppContext = createContext<AppContextValue | null>(null);

/** 界面的 callback 集合 */
type VisibleHookCallBacks = {
    /** 界面销毁 */
    onDestroy?: () => void;
    /** 界面显示 */
    onVisible?: () => void;
    /** 界面隐藏 */
    onHide?: () => void;
};
/** 界面显示、退出、销毁相关逻辑 */
export const usePageVisible = function (
    key: PageType,
    effectFun: () => VisibleHookCallBacks | undefined
) {
    const visible = useContext(AppContext)?.visiblePage === key;
    const callbacksRef = useRef<VisibleHookCallBacks | undefined>({});
    useEffect(() => {
        callbacksRef.current = effectFun();

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

/** 需要所有需要加载的资源类型 */
export enum LoadingSourceType {
    HOME_GLTF = 'HOME_GLTF',
    AVATAR_GLTF_LOWPOLY = 'AVATAR_GLTF_LOWPOLY',
    AVATAR_GLTF_LOWPOLY_PARTICLE = 'AVATAR_GLTF_LOWPOLY_PARTICLE',
    AVATAR_GLTF_CARTOON = 'AVATAR_GLTF_CARTOON',
    AVATAR_GLTF_DOKV = 'AVATAR_GLTF_DOKV',
    POSTER_IMG_0 = 'POSTER_IMG_0',
    POSTER_IMG_1 = 'POSTER_IMG_1',
    POSTER_IMG_2 = 'POSTER_IMG_2',
    POSTER_IMG_3 = 'POSTER_IMG_3',
    POSTER_IMG_4 = 'POSTER_IMG_4',
    POSTER_IMG_5 = 'POSTER_IMG_5',
}
const LoadingSourceTypeArray = Object.values(LoadingSourceType);
/** 参与 全局loading 进度计算的类型 */
const GlobalProgressTypes = [
    LoadingSourceType.HOME_GLTF,
    // LoadingSourceType.AVATAR_GLTF_LOWPOLY,
    // LoadingSourceType.AVATAR_GLTF_LOWPOLY_PARTICLE,
    // LoadingSourceType.AVATAR_GLTF_CARTOON,
    LoadingSourceType.AVATAR_GLTF_DOKV,
    LoadingSourceType.POSTER_IMG_0,
    LoadingSourceType.POSTER_IMG_1,
    LoadingSourceType.POSTER_IMG_2,
    LoadingSourceType.POSTER_IMG_3,
    LoadingSourceType.POSTER_IMG_4,
    LoadingSourceType.POSTER_IMG_5,
];
/** 全局 loading 数据，进度为 0-1 0 */
const globalLoadingState: Record<LoadingSourceType, number> = mapValues(
    LoadingSourceType,
    () => 0
);
export const loadingEE = new EE();
// 监听各个子 loading progress 事件
LoadingSourceTypeArray.forEach((type) => {
    loadingEE.on(`progress.${type}`, (progress: number) => {
        globalLoadingState[type] = Math.min(Math.max(0, progress), 1);
        // 触发 progress 事件，更新进度
        loadingEE.emit(
            'progress',
            mean(Object.values(pick(globalLoadingState, GlobalProgressTypes)))
        );
    });
});
