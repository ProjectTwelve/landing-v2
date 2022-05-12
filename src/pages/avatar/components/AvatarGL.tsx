import classnames from 'classnames';
import { gsap } from 'gsap';
import { first, shuffle } from 'lodash-es';
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useReducer,
    useRef,
} from 'react';
import { PageType } from '../../app/App.config';
import { loadingEE, usePageVisible } from '../../app/App.utils';
import { AvatarType } from '../Avatar.config';
import './AvatarGL.less';
import { AvatarGLItemCartoon } from './utils/AvatarGLItemCartoon';
import { AvatarGLItemDokv } from './utils/AvatarGLItemDokv';
import { AvatarGLItemLowpoly } from './utils/AvatarGLItemLowpoly';
import { AvatarCycle } from './AvatarCycle';
export interface AvatarGLRef {
    switchTo: (type: AvatarType | null) => void;
}

export const AVATAR_GL_MAP = {
    [AvatarType.DOKV]: new AvatarGLItemDokv(),
    [AvatarType.LOWPOLY]: new AvatarGLItemLowpoly(),
    [AvatarType.CARTOON]: new AvatarGLItemCartoon(),
};

export const AVATAR_GL_CYCLE = new AvatarCycle();

/** 决定要显示的 avatar 的顺序（第 0 个会优先加载，其他的会在界面进入后加载） */
const AVATAR_GL_KEYS = Object.keys(AVATAR_GL_MAP) as AvatarType[];
// 随机打乱的数组，打开注释即可使用
// const AVATAR_GL_KEYS = shuffle(Object.keys(AVATAR_GL_MAP));
const AVATAR_GL_ARRAY = AVATAR_GL_KEYS.map((k) => AVATAR_GL_MAP[k]);

export const AvatarGL = forwardRef<AvatarGLRef>((props, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const activatedRef = useRef<AvatarType | null>(null);
    const mouseRef = useRef<HTMLDivElement>(null);
    const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

    useImperativeHandle(
        ref,
        () => ({
            switchTo: (type) => {
                activatedRef.current &&
                    AVATAR_GL_MAP[activatedRef.current].leave();
                activatedRef.current = type;
                activatedRef.current &&
                    AVATAR_GL_MAP[activatedRef.current].enter();
                forceUpdate();
            },
        }),
        []
    );

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        AVATAR_GL_ARRAY.map((v) => v.mount(container));

        /** 首页loading结束后，再开始loading */
        // 先只加载首个资源
        loadingEE.on('loaded', () => first(AVATAR_GL_ARRAY)?.load());

        // 圆环加载
        AVATAR_GL_CYCLE.mount(container);
        AVATAR_GL_CYCLE.load();

        AVATAR_GL_ARRAY.forEach((v) => {
            v.on('enter', ({ isShowParticle }) =>
                handleToggleParticle(isShowParticle)
            );
            v.on('toggled', ({ isShowParticle }) => {
                handleToggleParticle(isShowParticle);
                AVATAR_GL_ARRAY.forEach((av) =>
                    av.toggleParticle(isShowParticle)
                );
            });
        });

        return () => {
            AVATAR_GL_ARRAY.map((v) => container && v.unMount());
            container && AVATAR_GL_CYCLE.unMount();
            AVATAR_GL_ARRAY.forEach((v) => {
                v.off('toggled');
            });
        };

        function handleToggleParticle(isShowParticle: boolean) {
            if (isShowParticle) {
                container?.classList.add('show-particle');
                container?.classList.remove('hidden-particle');
            } else {
                container?.classList.remove('show-particle');
                container?.classList.add('hidden-particle');
            }
        }
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
            // console.log('window', 'handleMouseDown');
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
                            await AVATAR_GL_ARRAY[i].load();
                        } catch (e) {
                            console.error('load error', e);
                        }
                    }
                })();
                handleMouseUp();
                window.addEventListener('mousemove', handleMouseMove);
                window.addEventListener('mousedown', handleMouseDown);
                window.addEventListener('mouseup', handleMouseUp);
            },
            onHide: () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mousedown', handleMouseDown);
                window.removeEventListener('mouseup', handleMouseUp);
            },
            onDestroy: () => {},
        };
    });

    return (
        <div className='avatar-gl' ref={containerRef}>
            <div className='avatar-mouse' id='avatar-mouse' ref={mouseRef}>
                <div className='avatar-mouse__circle'></div>
                <div className='avatar-mouse__dot'></div>
                <div className='avatar-mouse__arrow-bg'></div>
                <div className='avatar-mouse__arrow'></div>
            </div>
            <div className='avatar-extra'>
                {AVATAR_GL_KEYS.map((key) => {
                    const gl = AVATAR_GL_MAP[key];
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
                })}
            </div>
        </div>
    );
});
