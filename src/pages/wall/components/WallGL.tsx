import { useRef } from 'react';
import { PageType } from '../../app/App.config';
import { usePageVisible } from '../../app/App.utils';
import butterflyHelpers from './butterflyHelpers';
import './WallGL.less';

export const WallGL = (props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    usePageVisible(PageType.Wall, () => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) {
            return;
        }
        let frameId: number;
        let timeoutId: number;
        let intervalId: number;
        let gui = null;
        const hpgButterfly = (window as any).hpgButterfly;
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
            hpgButterfly.resize(window.innerWidth, window.innerHeight);
        };
        const loop = () => {
            // 性能优化：只在 wall 显示时调用
            // 用于测试是否渲染
            // console.log('wall loop');
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
            window.addEventListener('resize', onResize);
            onResize();

            properties = hpgButterfly.properties;
            const butterflyIdx = properties.scene.children.findIndex(
                (elem) => elem.type === 'Object3D'
            );
            properties.scene.children.splice(butterflyIdx);
            for (let key in butterflyHelpers.defaultProperties) {
                properties[key] = butterflyHelpers.defaultProperties[key];
            }
            // for param tweaking
            // gui = butterflyHelpers.turnOnGui();
        };
        const onVisible = () => {
            onResize();
            time = +new Date() / 1000;
            hpgButterfly.reset();
            loop();
            timeoutId = window.setTimeout(() => {
                intervalId = window.setInterval(
                    butterflyHelpers.startParamDrift.bind(
                        null,
                        butterflyHelpers.defaultProperties,
                        properties
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

        init();
        return {
            onVisible: () => {
                onVisible();
            },
            onHide: () => {
                onHide();
            },
            onDestroy: () => {
                window.removeEventListener('resize', onResize);
            },
        };
    });

    return (
        <div className='wall-gl' ref={containerRef}>
            <canvas className='butterfly-canvas' ref={canvasRef}></canvas>
        </div>
    );
};
