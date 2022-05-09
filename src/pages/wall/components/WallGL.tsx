/* eslint-disable */
import React, { useEffect, useRef } from 'react';
import { getPublicAssetPath } from '../../../utils';
import { PageType } from '../../app/App.config';
import { usePageVisible } from '../../app/App.utils';
import './WallGL.less';

export const WallGL = (props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    usePageVisible(PageType.Wall, () => {
        if (!containerRef.current) {
            return;
        }
        const container = containerRef.current;
        // 处理加载等逻辑

        return {
            onVisible: () => {
                const hpgButterfly = (window as any).hpgButterfly; // a global variable for this homepage graphic
                console.log('XXXTEMP hpgButterfly', hpgButterfly);
                var time = +new Date() / 1000;
                const canvas = document.querySelector('canvas#butterfly');
                const wall = document.querySelector('.wall');
                var isMultiTouch = false;
                var multiTouchChargeToggle = false;
                var touchEvents : any[] = [];
                var inputXY;
                let properties;

                if (hpgButterfly.checkIsSupported (canvas)) {
                    init();
                } else {
                    // No WebGL support here.
                }

                function init () {
                    console.log('XXXTEMP in butterfly init')
                    hpgButterfly.init();

                    // to restart and regenerate the butterfly
                    hpgButterfly.reset();

                    window.addEventListener('resize', onResize);
                    onResize();
                    loop();

                    // you can alter the input event as you wish to or even use some input event library.
                    wall!.addEventListener('mousedown', onDown);
                    wall!.addEventListener('touchstart', getTouchBound(onDown));
                    wall!.addEventListener('mousemove', onMove);
                    wall!.addEventListener('touchmove', getTouchBound(onMove));
                    wall!.addEventListener('mouseup', onUp);
                    wall!.addEventListener('touchend', getTouchBound(onUp));
                    wall!.addEventListener('click', onClick);

                    // the following is not needed in the production
                    properties = hpgButterfly.properties;
                    const butterflyIdx = properties.scene.children.findIndex(elem => elem.type === 'Object3D');
                    properties.scene.children.splice(butterflyIdx);
                    /*
                    var gui = new dat.GUI();
                    var scatteringGui = gui.addFolder('scattering');
                    scatteringGui.addColor(properties, 'baseColorHex');
                    scatteringGui.add(properties, 'scatterDivider', 1, 100, 0.0001).name('scattering divider');
                    scatteringGui.add(properties, 'scatterDividerPowInv', 0.05, 5, 0.0001).name('scattering inv');
                    scatteringGui.open();
                    var particleGui = gui.addFolder('particle');
                    particleGui.addColor(properties, 'color1Hex');
                    particleGui.addColor(properties, 'color2Hex');
                    particleGui.add(properties, 'particleMouseForce', 0.0001, 0.02, 0.0001).name('mouse force');
                    particleGui.open();
                    var pulseGui = gui.addFolder('pulse');
                    pulseGui.add(properties, 'pulseIntervalRatio', 0.1, 1, 0.0001).name('interval ratio');
                    pulseGui.add(properties, 'pulseDuration', 0.5, 5, 0.0001).name('duration');
                    pulseGui.open();
                    var postprocessingGui = gui.addFolder('postprocessing');
                    postprocessingGui.add(properties, 'blendRatio', 0.01, 1, 0.0001).name('temporal blending');
                    postprocessingGui.add(properties, 'rgbOffset', -0.02, 0.02, 0.0001).name('rgb offset');
                    postprocessingGui.add(properties, 'bloomAmount', 0, 3, 0.0001).name('bloom amount');
                    postprocessingGui.add(properties, 'bloomRadius', -1.5, 1.5, 0.0001).name('bloom radius');
                    postprocessingGui.open();*/
                }

                function getInputXY (evt) {
                    var rect = wall!.getBoundingClientRect();
                    var xy = {
                        x: evt.clientX - rect.left,
                        y: evt.clientY - rect.top
                    };
                    return {
                    x: (evt.clientX - rect.left) / rect.width * 2 - 1,
                    y: 1 - ((evt.clientY - rect.top) / rect.height * 2)
                    };
                }

                function onDown (evt) {
                    inputXY = getInputXY(evt);
                    onMove(evt);
                }

                function onMove (evt) {
                    var newInputXY = getInputXY(evt);
                    hpgButterfly.properties.mouse.set(newInputXY.x, newInputXY.y); // x, y as in {x:  -1 to 1, y: -1 to 1 }
                    if (!isMultiTouch) {
                        if (!inputXY) inputXY = newInputXY;
                        hpgButterfly.draw(inputXY.x, inputXY.y, newInputXY.x, newInputXY.y);
                    }
                    inputXY = newInputXY;
                }

                function onUp (evt) {
                }

                function onClick (evt) {
                    // to restart and regenerate the butterfly
                    hpgButterfly.reset();
                }

                function getTouchBound (fn) {
                    return function (evt) {
                        if (evt.preventDefault) evt.preventDefault();
                        isMultiTouch = evt.touches.length > 1;
                        if (isMultiTouch) {
                            touchEvents[0] = getInputXY(evt.touches[0]);
                            touchEvents[1] = getInputXY(evt.touches[1]);
                        }
                        // fn.call(null, evt.changedTouches[0] || evt.touches[0]);
                        // fn.call(null, evt.changedTouches[0] || evt.touches[0]);
                        // fn.call(null, evt.changedTouches[0] || evt.touches[0]);
                        fn.call(null, evt.changedTouches[0] || evt.touches[0]);
                    };
                }

                function onResize () {
                    // resize the web canvas to the screen size
                    hpgButterfly.resize(window.innerWidth, window.innerHeight);
                }

                function loop () {
                    requestAnimationFrame(loop);
                    render();
                }

                function render () {
                    var newTime = +new Date() / 1000;
                    var deltaTime = newTime - time;

                    // to create that "Charging Effect".
                    if (isMultiTouch) {
                        let from = touchEvents[multiTouchChargeToggle ? 0 : 1];
                        let to = touchEvents[multiTouchChargeToggle ? 1 : 0];
                        hpgButterfly.draw(from.x + (Math.random() - 0.5) * 0.1, from.y + (Math.random() - 0.5) * 0.1, to.x + (Math.random() - 0.5) * 0.1, to.y + (Math.random() - 0.5) * 0.1);
                        multiTouchChargeToggle = !multiTouchChargeToggle;
                    }

                    // pass delta time in second into the api
                    hpgButterfly.render(deltaTime);
                    time = newTime;
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
