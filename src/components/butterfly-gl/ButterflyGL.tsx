import { useRef } from 'react';
import { PageType } from '../../pages/app/App.config';
import { usePageVisible } from '../../pages/app/App.utils';
import butterflyHelpers from './butterflyHelpers';
import ResizeObserver from 'resize-observer-polyfill';
import './ButterflyGL.less';
import { IS_MOBILE } from '../../utils';

export interface ButterflyGLProps {
    page: PageType;
}
const ButterflyGLComponent = (props: ButterflyGLProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const currentDefaultProperties =
        butterflyHelpers.defaultProperties[props.page];

    usePageVisible(props.page, () => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) {
            return;
        }
        let frameId: number;
        let timeoutId: number;
        let intervalId: number;
        let gui: dat.GUI;
        const hpgButterfly = window.hpgButterfly;
        // for render timedelta calc
        let time;
        // butterfly properties obj ref
        let properties;

        let isMultiTouch = false;
        let multiTouchChargeToggle = false;
        let touchEvents: any[] = [];
        let inputXY;

        const onDown = (evt) => {
            inputXY = butterflyHelpers.getInputXY(evt, container);
            onMove(evt);
        };
        const onUp = (evt) => {};
        const onMove = (evt) => {
            var newInputXY = butterflyHelpers.getInputXY(evt, container);
            hpgButterfly.properties.mouse.set(newInputXY.x, newInputXY.y); // x, y as in {x:  -1 to 1, y: -1 to 1 }
            if (!isMultiTouch) {
                if (!inputXY) inputXY = newInputXY;
                hpgButterfly.draw(
                    inputXY.x,
                    inputXY.y,
                    newInputXY.x,
                    newInputXY.y
                );
            }
            inputXY = newInputXY;
        };
        const onClick = (evt) => {
            // to restart and regenerate the butterfly
            hpgButterfly.reset();
        };
        const onResize = () => {
            // resize the web canvas to the screen size
            // hpgButterfly.resize(window.innerWidth, window.innerHeight);
            if (container.offsetWidth && container.offsetHeight) {
                hpgButterfly.resize(container.offsetWidth, container.offsetHeight);
            }
        };
        const loop = () => {
            // 性能优化：只在 butterfly 显示时调用
            // 用于测试是否渲染
            // console.log('butterfly loop');
            frameId = requestAnimationFrame(loop);
            [time, multiTouchChargeToggle] = butterflyHelpers.render(
                hpgButterfly,
                time,
                isMultiTouch,
                touchEvents,
                multiTouchChargeToggle
            );
        };
        const init = () => {
            if (!hpgButterfly.checkIsSupported(canvas)) {
                return;
            }
            hpgButterfly.init();
            time = +new Date() / 1000;
            // you can alter the input event as you wish to or even use some input event library.
            container!.addEventListener('mousedown', onDown);
            container!.addEventListener(
                'touchstart',
                butterflyHelpers.getTouchBound(onDown, touchEvents, container)
            );
            container!.addEventListener('mousemove', onMove);
            container!.addEventListener(
                'touchmove',
                butterflyHelpers.getTouchBound(onMove, touchEvents, container)
            );
            container!.addEventListener('mouseup', onUp);
            container!.addEventListener(
                'touchend',
                butterflyHelpers.getTouchBound(onUp, touchEvents, container)
            );
            container!.addEventListener('click', onClick);
            onResize();

            properties = hpgButterfly.properties;
            // const butterflyIdx = properties.scene.children.findIndex(
            //     (elem) => elem.type === 'Object3D'
            // );
            // properties.scene.children.splice(butterflyIdx);
            properties.scene.children = properties.scene.children.filter(
                (v) => v.type !== 'Object3D'
            );

            for (let key in currentDefaultProperties) {
                properties[key] = currentDefaultProperties[key];
            }
            // for param tweaking
            // gui = butterflyHelpers.turnOnGui(properties);
        };
        const onVisible = () => {
            init();
            onResize();
            time = +new Date() / 1000;
            butterflyHelpers.resetParams(currentDefaultProperties, properties);
            hpgButterfly.reset();
            loop();
            timeoutId = window.setTimeout(() => {
                intervalId = window.setInterval(
                    butterflyHelpers.startParamDrift.bind(
                        null,
                        currentDefaultProperties,
                        properties,
                        true
                    ),
                    6000
                );
            }, 3000);
        };
        const onHide = () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
            cancelAnimationFrame(frameId);
        };

        const observer = new ResizeObserver(onResize);
        observer.observe(container);

        return {
            onVisible: () => {
                onVisible();
            },
            onHide: () => {
                onHide();
            },
            onDestroy: () => {
                observer.disconnect();
                window.removeEventListener('resize', onResize);
            },
        };
    });

    return (
        <div className='butterfly-gl' ref={containerRef}>
            <canvas
                className={`butterfly-canvas butterfly-canvas-${props.page}`}
                ref={canvasRef}
            ></canvas>
        </div>
    );
};

export const ButterflyGL = (props: ButterflyGLProps) => {
    if (!window.hpgButterfly) {
        return null;
    }
    return <ButterflyGLComponent {...props} />;
};
