// tweaking purposes only
import * as dat from 'dat.gui';

/**
 * default prop values
 */
const defaultProperties = {
    'wall': {
        // ver 0
        'blendRatio': 0.8,
        'rgbOffset': 0.012,
        'bloomAmount': 1.8,
        'bloomRadius': 1.6,
        'baseColorHex': 0x0,
        'color1Hex': 0xe2f7ff,
        'color2Hex': 0x00fc76,
        'particleMouseForce': 0.005,
        'scatterDivider': 12,
        'scatterDividerPowInv': 0.08,
        'pulseDuration': 48,
        'pulseIntervalRatio': 0.5,
    },

    'home': {
        'blendRatio': 0.4,
        'rgbOffset': -0.02,
        'bloomAmount': 0.4,
        'bloomRadius': -12,
        'baseColorHex': 0x0,
        'color1Hex': 0xe2f7ff,
        'color2Hex': 0x00fc76,
        'particleMouseForce': 0.005,
        'scatterDivider': 6,
        'scatterDividerPowInv': 1.2,
        'pulseDuration': 48,
        'pulseIntervalRatio': 0.5,
    },
    'avatar': {
        'blendRatio': 0.4,
        'rgbOffset': 0,
        'bloomAmount': 6,
        'bloomRadius': 0,
        'baseColorHex': 0x0,
        'color1Hex': 0xe2f7ff,
        'color2Hex': 0x00fc76,
        'particleMouseForce': 0.005,
        'scatterDivider': 999,
        'scatterDividerPowInv': 0.0001,
        'pulseDuration': 999,
        'pulseIntervalRatio': 0.5,
    }
    // ver 1
    //"blendRatio":0.4,"rgbOffset":0.024,"bloomAmount":0.4,"bloomRadius":1.6,"baseColorHex":2236962,"color1Hex":1612924,"color2Hex":64630,"particleMouseForce":0.02,"scatterDivider":6,"scatterDividerPowInv":0.08,"pulseDuration":96,"pulseIntervalRatio":0.125,
    
    // ver 2
    // "blendRatio":0.4,"rgbOffset":0.048,"bloomAmount":0.8,"bloomRadius":3.2,"baseColorHex":2236962,"color1Hex":1612924,"color2Hex":6337751,"particleMouseForce":0.04,"scatterDivider":6,"scatterDividerPowInv":0.04,"pulseDuration":48,"pulseIntervalRatio":0.25,

    // ver 3
    // "blendRatio":0.8,"rgbOffset":0.024,"bloomAmount":1.6,"bloomRadius":3.2,"baseColorHex":2236962,"color1Hex":1612924,"color2Hex":6337751,"particleMouseForce":0.04,"scatterDivider":3,"scatterDividerPowInv":0.02,"pulseDuration":96,"pulseIntervalRatio":0.25,

    // ver 4
    // "blendRatio":0.8,"rgbOffset":0.003,"bloomAmount":0.8,"bloomRadius":0.4,
    // 'baseColorHex': 0x222222,
    // 'color1Hex': 0xe2f7ff,
    // 'color2Hex': 0x00fc76,
    // "particleMouseForce":0.005,"scatterDivider":24,"scatterDividerPowInv":0.08,"pulseDuration":48,"pulseIntervalRatio":0.5,
    
    // ver 5
    // "blendRatio":0.4,"rgbOffset":0.003,"bloomAmount":0.8,"bloomRadius":0.4,
    // 'baseColorHex': 0x222222,
    // 'color1Hex': 0xe2f7ff,
    // 'color2Hex': 0x00fc76,
    // "particleMouseForce":0.005,"scatterDivider":24,"scatterDividerPowInv":0.04,"pulseDuration":48,"pulseIntervalRatio":0.5,

    // ver 6
    // "blendRatio":0.2,"rgbOffset":0.006,"bloomAmount":1.6,"bloomRadius":0.4,
    // 'baseColorHex': 0x111111,
    // 'color1Hex': 0xe2f7ff,
    // 'color2Hex': 0x00fc76,
    // "particleMouseForce":0.005,"scatterDivider":48,"scatterDividerPowInv":0.04,"pulseDuration":48,"pulseIntervalRatio":1

    // ver 7
    // "blendRatio":0.2,"rgbOffset":0.003,"bloomAmount":0.8,"bloomRadius":0.8,
    // 'baseColorHex': 0x111111,
    // 'color1Hex': 0xe2f7ff,
    // 'color2Hex': 0x00fc76,
    // "particleMouseForce":0.02,"scatterDivider":24,"scatterDividerPowInv":0.01,"pulseDuration":384,"pulseIntervalRatio":2,
};

/**
* helper function definitions
*/
const decideOneRandomChoice = (choices: any[]) => {
    return choices[Math.floor(Math.random() * choices.length)];
};

const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getInputXY = (evt, wall) => {
    const rect = wall!.getBoundingClientRect();
    // var xy = {
    //     x: evt.clientX - rect.left,
    //     y: evt.clientY - rect.top
    // };
    return {
        x: (evt.clientX - rect.left) / rect.width * 2 - 1,
        y: 1 - ((evt.clientY - rect.top) / rect.height * 2)
    };
};

const turnOnGui = (properties) => {
    console.log('XXXTEMP dat gui')
    const gui = new dat.GUI();
    const scatteringGui = gui.addFolder('scattering');
    scatteringGui.addColor(properties, 'baseColorHex');
    scatteringGui.add(properties, 'scatterDivider', 1, 1000, 0.0001).name('scattering divider');
    scatteringGui.add(properties, 'scatterDividerPowInv', 0.05, 50, 0.0001).name('scattering inv');
    scatteringGui.open();
    const particleGui = gui.addFolder('particle');
    particleGui.addColor(properties, 'color1Hex');
    particleGui.addColor(properties, 'color2Hex');
    particleGui.add(properties, 'particleMouseForce', 0.0001, 2, 0.0001).name('mouse force');
    particleGui.open();
    const pulseGui = gui.addFolder('pulse');
    pulseGui.add(properties, 'pulseIntervalRatio', 0.1, 10, 0.0001).name('interval ratio');
    pulseGui.add(properties, 'pulseDuration', 0.5, 50, 0.0001).name('duration');
    pulseGui.open();
    const postprocessingGui = gui.addFolder('postprocessing');
    postprocessingGui.add(properties, 'blendRatio', 0.01, 10, 0.0001).name('temporal blending');
    postprocessingGui.add(properties, 'rgbOffset', -0.02, 2, 0.0001).name('rgb offset');
    postprocessingGui.add(properties, 'bloomAmount', 0, 30, 0.0001).name('bloom amount');
    postprocessingGui.add(properties, 'bloomRadius', -1.5, 15, 0.0001).name('bloom radius');
    postprocessingGui.open();
    gui.show();
    return gui;
};

const resetParams = (defaultProperties, properties) => {
    Object.assign(properties, defaultProperties);
};

const startParamDrift = (defaultProperties, properties) => {
    const choices = ['dec', 'inc', 'other'];
    const colorParams = [
        'baseColorHex',
        'color1Hex',
        'color2Hex',
    ];
    const invertibles = [
        'rgbOffset',
        'bloomRadius',
    ];
    const params = Object.keys(defaultProperties);
    for (let param of params) {
        let choice = decideOneRandomChoice(choices);
        switch (choice) {
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
            case 'other':
                let averageStrenth = 3;
                if (param === 'baseColorHex') {
                    averageStrenth = 9;
                } else if (colorParams.includes(param)) {
                    properties[param] =
                        Math.floor(
                            (averageStrenth * getRandomInt(0x0, 0xffffff) + properties[param])
                            /
                            (averageStrenth + 1)
                        );
                } else if (invertibles.includes(param)) {
                    properties[param] = properties[param] * -1;
                }
                break;
            default:
        }
        /**
         * We implement here 'revert to default' mechanism, when param goes too extreme
         */
        // not needed for colorparams
        if (colorParams.includes(param)) {
            continue;
        }
        // when param goes too extreme, revert at 80% chance
        if (Math.random() < 0.8) {
            if (Math.abs(properties[param]) > Math.abs(defaultProperties[param] * 64)) {
                properties[param] = defaultProperties[param] * 4;
            } else if (Math.abs(properties[param]) < Math.abs(defaultProperties[param] / 64)) {
                properties[param] = defaultProperties[param] / 4;
            }
        }
    }
    const presentValues = params.reduce((prev, cur) => {
        prev[cur] = properties[cur];
        return prev;
    }, {});
    console.log('Param drifting');
    console.log(JSON.stringify(presentValues));
};

const getTouchBound = (fn, touchEvents, wall) => {
    return function (evt) {
        if (evt.preventDefault) evt.preventDefault();
        const isMultiTouch = evt.touches.length > 1;
        if (isMultiTouch) {
            touchEvents[0] = getInputXY(evt.touches[0], wall);
            touchEvents[1] = getInputXY(evt.touches[1], wall);
        }
        fn.call(null, evt.changedTouches[0] || evt.touches[0]);
    };
};

const render = (hpgButterfly, time, isMultiTouch, touchEvents, multiTouchChargeToggle) => {
    const newTime = +new Date() / 1000;
    const deltaTime = newTime - time;

    // to create that "Charging Effect".
    if (isMultiTouch) {
        const from = touchEvents[multiTouchChargeToggle ? 0 : 1];
        const to = touchEvents[multiTouchChargeToggle ? 1 : 0];
        hpgButterfly.draw(from.x + (Math.random() - 0.3) * 0.1, from.y + (Math.random() - 0.3) * 0.1, to.x + (Math.random() - 0.3) * 0.1, to.y + (Math.random() - 0.5) * 0.1);
        multiTouchChargeToggle = !multiTouchChargeToggle;
    }

    // pass delta time in second into the api
    hpgButterfly.render(deltaTime);
    return [newTime, multiTouchChargeToggle];
};

const butterflyHelpers = {
    defaultProperties,
    decideOneRandomChoice,
    getRandomInt,
    getInputXY,
    turnOnGui,
    startParamDrift,
    resetParams,
    getTouchBound,
    render,
};
export default butterflyHelpers;
