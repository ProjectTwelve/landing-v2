/* eslint-disable */
import React, { useEffect, useRef } from 'react';
import { getPublicAssetPath } from '../../../utils';
import { PageType } from '../../app/App.config';
import { usePageVisible } from '../../app/App.utils';
import './WallGL.less';
import * as dat from 'dat.gui';

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
                var time = +new Date() / 1000;
                const canvas = document.querySelector('canvas#butterfly');
                const wall = document.querySelector('.wall');
                var isMultiTouch = false;
                var multiTouchChargeToggle = false;
                var touchEvents : any[] = [];
                var inputXY;
                let properties;
                const defaultProperties = {
                   'blendRatio': 0.8,
                   'rgbOffset': 0.012,
                   'bloomAmount': 0.8,
                   'bloomRadius': 1.6,
                   'baseColorHex': 0x222222,
                   'color1Hex': 0xe2f7ff,
                   'color2Hex': 0x00fc76,
                   'particleMouseForce': 0.005,
                   'scatterDivider': 12,
                   'scatterDividerPowInv': 0.16,

                   'pulseDuration': 48,
                   'pulseIntervalRatio': 0.5,
                };

                if (hpgButterfly.checkIsSupported (canvas)) {
                    init();
                } else {
                    // No WebGL support here.
                }

                function init () {
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
                    for (let key in defaultProperties) {
                        properties[key] = defaultProperties[key];
                    }
                    
                    // console.log('XXXTEMP dat gui')
                    // var gui = new dat.GUI();
                    // var scatteringGui = gui.addFolder('scattering');
                    // scatteringGui.addColor(properties, 'baseColorHex');
                    // scatteringGui.add(properties, 'scatterDivider', 1, 1000, 0.0001).name('scattering divider');
                    // scatteringGui.add(properties, 'scatterDividerPowInv', 0.05, 50, 0.0001).name('scattering inv');
                    // scatteringGui.open();
                    // var particleGui = gui.addFolder('particle');
                    // particleGui.addColor(properties, 'color1Hex');
                    // particleGui.addColor(properties, 'color2Hex');
                    // particleGui.add(properties, 'particleMouseForce', 0.0001, 2, 0.0001).name('mouse force');
                    // particleGui.open();
                    // var pulseGui = gui.addFolder('pulse');
                    // pulseGui.add(properties, 'pulseIntervalRatio', 0.1, 10, 0.0001).name('interval ratio');
                    // pulseGui.add(properties, 'pulseDuration', 0.5, 50, 0.0001).name('duration');
                    // pulseGui.open();
                    // var postprocessingGui = gui.addFolder('postprocessing');
                    // postprocessingGui.add(properties, 'blendRatio', 0.01, 10, 0.0001).name('temporal blending');
                    // postprocessingGui.add(properties, 'rgbOffset', -0.02, 2, 0.0001).name('rgb offset');
                    // postprocessingGui.add(properties, 'bloomAmount', 0, 30, 0.0001).name('bloom amount');
                    // postprocessingGui.add(properties, 'bloomRadius', -1.5, 15, 0.0001).name('bloom radius');
                    // postprocessingGui.open();
                    // gui.show();

                    setTimeout(() => {
                        setInterval(startParamDrift, 6000);
                    }, 3000);
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

                function startParamDrift() {
                    const choices = ['dec', 'inc', 'const'];
                    const colorParams = [
                        'baseColorHex',
                        'color1Hex',
                        'color2Hex',
                    ];
                    const params = Object.keys(defaultProperties);
                    for (let param of params) {
                        let choice = decideOneRandomChoice(choices);
                        switch(choice) {
                            case 'dec':
                                console.log(`dec before and after ${param} ${properties[param]}`);
                                if (!colorParams.includes(param)) {
                                    properties[param] = properties[param] / 2;
                                }
                                break;
                            case 'inc':
                                console.log(`inc before and after ${param} ${properties[param]}`);
                                if (!colorParams.includes(param)) {
                                    properties[param] = properties[param] * 2;
                                }
                                break;
                            case 'const':
                                if (colorParams.includes(param)) {
                                    properties[param] = 
                                        Math.floor((3 * getRandomInt(0x0, 0xffffff) + properties[param]) / 4);
                                }
                                break;
                            default:
                        }
                    }
                }

                function decideOneRandomChoice(choices) {
                    return choices[Math.floor(Math.random() * choices.length)];
                }

                function getRandomInt(min, max) {
                    min = Math.ceil(min);
                    max = Math.floor(max);
                    return Math.floor(Math.random() * (max - min + 1)) + min;
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
