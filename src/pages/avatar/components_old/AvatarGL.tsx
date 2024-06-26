import classnames from 'classnames';
import { gsap } from 'gsap';
import { cloneDeep, first, includes, indexOf } from 'lodash-es';
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useReducer,
    useRef,
} from 'react';
import { PageType } from '../../app/App.config';
import { loadingEE, usePageVisible } from '../../app/App.utils';
import { AvatarType, AVATAR_GL_INFO_MAP, AVATAR_GL_KEYS } from '../Avatar.config';
import './AvatarGL.less';
import { AvatarCycle } from './AvatarCycle';
import { ButterflyGL } from '../../../components/butterfly-gl/ButterflyGL';
import { IS_MOBILE } from '../../../utils';
import { AvatarGLModel } from './utils/base/AvatarGLItemBaseWithModel';
export interface AvatarGLRef {
    switchTo: (type: AvatarType | null, currentPage?: PageType) => void;
    acitveTo: (page: PageType) => void;
    stopTimeout: () => void;
    restartTimout: () => void;
}
export interface AvatarGLProps {
    allLoaded: () => void;
}
const lazyKeys = AVATAR_GL_KEYS.slice(2, AVATAR_GL_KEYS.length);

type AvatarTypeStrings = keyof typeof AvatarType;

type AVATARGLMAP = {
    [avatar in AvatarTypeStrings]: AvatarGLModel | null;
}

export const AVATAR_GL_MAP: AVATARGLMAP = {
    [AvatarType.Dokv]: new AvatarGLModel(AVATAR_GL_INFO_MAP[AvatarType.Dokv]),
    [AvatarType.Cartoon]: null,
    [AvatarType.Lowpoly]: null,
    [AvatarType.SK_Cartoon_Female_021]: null,
    [AvatarType.SK_Cartoon_Female_029]: null,
    [AvatarType.SK_Cartoon_Female_059]: null,
    [AvatarType.SK_Lowpoly_Male_002]: null,
    [AvatarType.SK_Lowpoly_Male_028]: null,
    [AvatarType.SK_Lowpoly_Male_040]: null,
    [AvatarType.SK_Cartoon_03]: null,
    [AvatarType.SK_Cartoon_06]: null,
    [AvatarType.SK_Cartoon_09]: null,
    [AvatarType.SK_Cartoon_14]: null,
    [AvatarType.SK_Cartoon_18]: null,
    [AvatarType.SK_Cartoon_19]: null,
    [AvatarType.SK_Cartoon_20]: null,
    [AvatarType.SK_Cartoon_27]: null,
    [AvatarType.SK_Cartoon_31]: null,
    [AvatarType.SK_Cartoon_32]: null,
    [AvatarType.SK_Cartoon_41]: null,
    [AvatarType.SK_Cartoon_44]: null,
    [AvatarType.SK_Cartoon_47]: null,
    [AvatarType.SK_Cartoon_52]: null,
    [AvatarType.SK_Cartoon_57]: null,
    [AvatarType.SK_Cartoon_60]: null,
    [AvatarType.SK_Cartoon_61]: null,
    // [AvatarType.SK_Lowpoly_06]: null,
    // [AvatarType.SK_Lowpoly_08]: null,
    // [AvatarType.SK_Lowpoly_11]: null,
    [AvatarType.SK_Lowpoly_16]: null,
    [AvatarType.SK_Lowpoly_25]: null,
    [AvatarType.SK_Lowpoly_31]: null,
    // [AvatarType.SK_Lowpoly_38]: null,
    [AvatarType.SK_Lowpoly_42]: null,
    [AvatarType.SK_Lowpoly_44]: null,
    [AvatarType.SK_Lowpoly_46]: null,
    [AvatarType.SK_Lowpoly_47]: null,
    [AvatarType.SK_Lowpoly_58]: null,
};

export const AVATAR_GL_CYCLE = new AvatarCycle();

/** 决定要显示的 avatar 的顺序（第 0 个会优先加载，其他的会在界面进入后加载） */
// const AVATAR_GL_KEYS = Object.keys(AVATAR_GL_MAP) as AvatarType[];


const AVATAR_GL_ARRAY = AVATAR_GL_KEYS.map((k) => AVATAR_GL_MAP[k]);


export const AvatarGL = forwardRef<AvatarGLRef, AvatarGLProps>((props, ref) => {
    const { allLoaded } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const activatedRef = useRef<AvatarType | null>(null);
    const mouseRef = useRef<HTMLDivElement>(null);
    const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
    useImperativeHandle(
        ref,
        () => ({
            switchTo: async (type: AvatarType | null, currentPage) => {
                console.log('[ type ] >', type)
                console.log('[ currentPage ] >', currentPage)
                const currentIndex = indexOf(AVATAR_GL_KEYS, type);
                const length = AVATAR_GL_KEYS.length;
                let nextType = AvatarType.Dokv;
                if (currentIndex === length - 1) {
                    nextType = AvatarType.Dokv;
                } else {
                    nextType = AVATAR_GL_KEYS[currentIndex + 1];
                   
                }
                // 由于手机端只能显示三个WebGL render，所以需要维持只存在三个实例
                if (activatedRef.current === nextType) {
                    activatedRef.current &&
                        AVATAR_GL_MAP[nextType]!.leave(true);
                    AVATAR_GL_MAP[nextType] = null;
                } else {
                    activatedRef.current &&
                        AVATAR_GL_MAP[activatedRef.current]!.leave(true);
                    if(activatedRef.current){
                        AVATAR_GL_MAP[activatedRef.current] = null;
                    }
                }
                let previousActivate = cloneDeep(activatedRef.current);

                activatedRef.current = type;

                if (type) {
                    // 加载当前和下一个， 其他的全部销毁
                    for (let i = 0; i < AVATAR_GL_KEYS.length; i++) {
                        const element = AVATAR_GL_KEYS[i];
                        if (element === type || element === nextType) {
                            if(element === nextType){
                                AVATAR_GL_MAP[element] = new AvatarGLModel(AVATAR_GL_INFO_MAP[element]);
                                setTimeout(() => {
                                    AVATAR_GL_MAP[element]?.load();
                                }, 3000)
                            }
                            if ((previousActivate === nextType && element === type) || AVATAR_GL_MAP[type] === null) {
                                AVATAR_GL_MAP[element] = new AvatarGLModel(AVATAR_GL_INFO_MAP[element]);
                                AVATAR_GL_MAP[element]?.load();
                            }
                        } else {
                            AVATAR_GL_MAP[element] = null;
                        }
                    }
                    const container = containerRef.current;
                    if (!container) {
                        return;
                    }
                    activatedRef.current && AVATAR_GL_MAP[activatedRef.current]!.mount(container);
                    
                   
                    
                }
                let isLoading = true;
                if (type) {
                    isLoading = includes(AVATAR_GL_MAP[type]?.loadingStatus, false);
                }
                type && AVATAR_GL_MAP[type]!.on('allLoaded', () => {
                    if (AVATAR_GL_MAP[type]?.isAvatarPage && AVATAR_GL_MAP[type]?.isEnter) {
                        allLoaded();
                    }
                })
                type &&
                    AVATAR_GL_MAP[type]!.enter(currentPage, isLoading);

                forceUpdate();

            },
            acitveTo: (page: PageType) => {
                activatedRef.current && AVATAR_GL_MAP[activatedRef.current]?.active(page);
            },
            stopTimeout: () => {
                activatedRef.current && AVATAR_GL_MAP[activatedRef.current]?.stopTimeout();
            },
            restartTimout: () => {
                activatedRef.current && AVATAR_GL_MAP[activatedRef.current]?.restartTimout();
            }
        }),

        []
    );

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        AVATAR_GL_ARRAY.map((v) => v && v.mount(container));

        /** 首页loading结束后，再开始loading */
        // 先只加载首个资源
        loadingEE.on('loaded', () => first(AVATAR_GL_ARRAY)?.load());
        // console.log('===== container.parentElement =====', container.parentElement);
        container.parentElement?.addEventListener('mousemove', AVATAR_GL_CYCLE.onMouseMove.bind(AVATAR_GL_CYCLE));

        // 圆环加载
        AVATAR_GL_CYCLE.mount(container);
        AVATAR_GL_CYCLE.load();

        AVATAR_GL_ARRAY.forEach((v) => {
            if (v) {
                v.on('allLoaded', () => {
                    if (v?.isAvatarPage && v?.isEnter) {
                        allLoaded();
                    }
                })
            }
        });

        return () => {
            AVATAR_GL_ARRAY.map((v) => container && v && v.unMount());
            container && AVATAR_GL_CYCLE.unMount();
            AVATAR_GL_ARRAY.forEach((v) => {
                v && v.off('allLoaded');
            });
        };

    }, []);

    usePageVisible(PageType.Avatar, () => {
        const container = containerRef.current;
        const mouseDom = mouseRef.current;
        if (!container || !mouseDom) {
            return;
        }
        const handleMouseMove = (e) => {
            gsap.to(mouseDom, {
                duration: 0.1,
                opacity: 1,
                x: e.clientX + document.body.scrollLeft,
                y: e.clientY + document.body.scrollTop,
            });
        };
        const handleMouseDown = () => {
            mouseDom?.classList.add('active');
        };
        const handleMouseUp = () => {
            mouseDom?.classList.remove('active');
        };
        return {
            onVisible: () => {
                // 进入界面后，“依次”加载所有内容（上一个加载完，再加载下一个）
                (async () => {
                    for (let i = 0; i < AVATAR_GL_ARRAY.length; i++) {
                        try {
                            const item = AVATAR_GL_ARRAY[i];
                            if (item !== null) {
                                await item.load();
                            }
                        } catch (e) {
                            console.error('load error', e);
                        }
                    }
                })();
                if (!IS_MOBILE) {
                    handleMouseUp();
                    window.addEventListener('mousemove', handleMouseMove);
                    window.addEventListener('mousedown', handleMouseDown);
                    window.addEventListener('mouseup', handleMouseUp);
                }
            },
            onHide: () => {
                if (!IS_MOBILE) {
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mousedown', handleMouseDown);
                    window.removeEventListener('mouseup', handleMouseUp);
                }
            },
            onDestroy: () => { },
        };
    });

    return (
        <div className='avatar-gl' ref={containerRef}>
            <ButterflyGL page={PageType.Avatar} />
            <div className='avatar-mouse' id='avatar-mouse' ref={mouseRef}>
                <div className='avatar-mouse__circle'></div>
                <div className='avatar-mouse__dot'></div>
                <div className='avatar-mouse__arrow-bg'></div>
                <div className='avatar-mouse__arrow'></div>
            </div>
            <div className='avatar-extra'>
                {AVATAR_GL_KEYS.map((key) => {
                    const gl = AVATAR_GL_MAP[key];
                    if (gl && gl.extraNode) {
                        return (
                            <div
                                className={classnames('avatar-extra-item', {
                                    active: activatedRef.current === key,
                                })}
                                key={key}
                            >
                                {gl.extraNode}
                            </div>
                        );
                    } else {
                        return null
                    }

                })}
            </div>
        </div>
    );
});
