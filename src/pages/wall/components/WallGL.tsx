import { useRef } from 'react';
import { PageType } from '../../app/App.config';
import { usePageVisible } from '../../app/App.utils';
import butterflyHelpers from './butterflyHelpers';
import './WallGL.less';

export const WallGL = (props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    usePageVisible(PageType.Wall, () => {
        if (!containerRef.current) {
            return;
        }
        let gui = null;
        const hpgButterfly = (window as any).hpgButterfly;
        const canvas = document.querySelector('canvas#butterfly');
        const wall = document.querySelector('.wall');
        // for render timedelta calc
        let time;
        // butterfly properties obj ref
        let properties;

        let isMultiTouch = false;
        let multiTouchChargeToggle = false;
        let touchEvents : any[] = [];
        let inputXY;

        const onDown = (evt) => {
            inputXY = butterflyHelpers.getInputXY(evt, wall);
            onMove(evt);
        };
        const onUp = (evt) => {
        };
        const onMove = (evt) => {
            var newInputXY = butterflyHelpers.getInputXY(evt, wall);
            hpgButterfly.properties.mouse.set(newInputXY.x, newInputXY.y); // x, y as in {x:  -1 to 1, y: -1 to 1 }
            if (!isMultiTouch) {
                if (!inputXY) inputXY = newInputXY;
                hpgButterfly.draw(inputXY.x, inputXY.y, newInputXY.x, newInputXY.y);
            }
            inputXY = newInputXY;
        }
        const onClick = (evt) => {
            // to restart and regenerate the butterfly
            hpgButterfly.reset();
        }
        const onResize = () => {
            // resize the web canvas to the screen size
            hpgButterfly.resize(window.innerWidth, window.innerHeight);
        }
        const loop = () => {
            requestAnimationFrame(loop);
            [time, multiTouchChargeToggle] = butterflyHelpers.render(hpgButterfly, time, isMultiTouch, touchEvents, multiTouchChargeToggle);
        }
        const init = () => {
            hpgButterfly.init();
            hpgButterfly.reset();
            time = +new Date() / 1000;

            window.addEventListener('resize', onResize);
            onResize();
            loop();

            // you can alter the input event as you wish to or even use some input event library.
            wall!.addEventListener('mousedown', onDown);
            wall!.addEventListener('touchstart', butterflyHelpers.getTouchBound(onDown, touchEvents, wall));
            wall!.addEventListener('mousemove', onMove);
            wall!.addEventListener('touchmove', butterflyHelpers.getTouchBound(onMove, touchEvents, wall));
            wall!.addEventListener('mouseup', onUp);
            wall!.addEventListener('touchend', butterflyHelpers.getTouchBound(onUp, touchEvents, wall));
            wall!.addEventListener('click', onClick);

            properties = hpgButterfly.properties;
            const butterflyIdx = properties.scene.children.findIndex(elem => elem.type === 'Object3D');
            properties.scene.children.splice(butterflyIdx);
            for (let key in butterflyHelpers.defaultProperties) {
                properties[key] = butterflyHelpers.defaultProperties[key];
            }

            // for param tweaking
            // gui = butterflyHelpers.turnOnGui();
            
            setTimeout(() => {
                setInterval(
                    butterflyHelpers.startParamDrift.bind(
                        null,
                        butterflyHelpers.defaultProperties,
                        properties
                    ), 6000);
            }, 3000);
        }
        return {
            onVisible: () => {
                if (hpgButterfly.checkIsSupported (canvas)) {
                    init();
                } else {
                    console.warn('No WEBGL. Aborting..');
                }
            },
            onHide: () => {
                // 界面隐藏的逻辑，清除负作用
            },
            onDestroy: () => {
                // 组件 unMount
            },
        };
    });

    return (
        <div className='wall-gl' ref={containerRef}>
            <canvas id='butterfly'></canvas>
        </div>
    );
};
