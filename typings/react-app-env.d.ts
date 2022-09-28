/// <reference types="react-scripts" />
declare module '*.module.less' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module 'parallax-js';

interface Thenable<TResult1 = any, TResult2 = any> {
    then<TResult1, TResult2>(
        onFulfilled?: Function | undefined | null,
        onRejected?: Function | undefined | null
    ): Thenable<TResult1 | TResult2>;
}

declare interface Window {
    /** 新界面正在显示 */
    appVisibleAnimating: number;
    /** 旧界面正在隐藏 */
    appHideAnimating: number;

    hpgButterfly?: any;
}
