// var hpgButterfly = window.hpgButterfly; // a global variable for this homepage graphic
// // console.log('window.hpgButterfly.properties.scene.children', window.hpgButterfly.properties.scene.children)
// var time = +new Date() / 1000;
// var canvas = document.querySelector('canvas#butterfly');
// var isMultiTouch = false;
// var multiTouchChargeToggle = false;
// var touchEvents = [];
// var inputXY;
// var colorChangeCounter = 0;
// var color1 = 0x3a95f1;
// var color2 = 0x3a95f1;
// // var butterflyDeleted = false;

// if (hpgButterfly.checkIsSupported (canvas)) {
//     init();
// }
// else {
//     // No WebGL support here.
// }
// function init () {
//     hpgButterfly.init();
//     // to restart and regenerate the butterfly
//     hpgButterfly.reset();
//     window.hpgButterfly.properties.scene.children.pop() // 删除蝴蝶
//     // hpgButterfly.properties.scene.children.splice(1,1); // 删除光点
//     hpgButterfly.properties.color1Hex = color1
//     hpgButterfly.properties.color2Hex = color2
//     hpgButterfly.properties.rgbOffset= 0.01 // 三原色分开渲染，位移的间距大小
//     hpgButterfly.properties.pulseDuration = 5
//     hpgButterfly.properties.pulseIntervalRatio = 1.8
//     // hpgButterfly.properties.color2Hex = color2
//     window.addEventListener('resize', onResize);
//     onResize();
//     loop();
//     // you can alter the input event as you wish to or even use some input event library.
//     canvas.addEventListener('mousedown', onDown);
//     canvas.addEventListener('touchstart', getTouchBound(onDown));
//     canvas.addEventListener('mousemove', onMove);
//     canvas.addEventListener('touchmove', getTouchBound(onMove));
//     canvas.addEventListener('mouseup', onUp);
//     canvas.addEventListener('touchend', getTouchBound(onUp));
//     // canvas.addEventListener('click', onClick);
//     var properties = hpgButterfly.properties;
// }

// function getInputXY (evt) {
//     var rect = canvas.getBoundingClientRect();
//     var xy = {
//         x: evt.clientX - rect.left,
//         y: evt.clientY - rect.top
//     };
//     return {
//         x: (evt.clientX - rect.left) / rect.width * 2 - 1,
//         y: 1 - ((evt.clientY - rect.top) / rect.height * 2)
//     };
// }

// function onDown (evt) {
//     inputXY = getInputXY(evt);
//     onMove(evt);
// }

// function onMove (evt) {
//     var newInputXY = getInputXY(evt);
//     hpgButterfly.properties.mouse.set(newInputXY.x, newInputXY.y); // x, y as in {x:  -1 to 1, y: -1 to 1 }
//     if (!isMultiTouch) {
//         if (!inputXY) inputXY = newInputXY;
//         hpgButterfly.draw(inputXY.x, inputXY.y, newInputXY.x, newInputXY.y);
//     }
//     inputXY = newInputXY;
// }

// function onUp (evt) {
// }

// function onClick (evt) {
//     // to restart and regenerate the butterfly
//     hpgButterfly.reset();
// }

// function getTouchBound (fn) {
//     return function (evt) {
//         if (evt.preventDefault) evt.preventDefault();
//         isMultiTouch = evt.touches.length > 1;
//         if (isMultiTouch) {
//             touchEvents[0] = getInputXY(evt.touches[0]);
//             touchEvents[1] = getInputXY(evt.touches[1]);
//         }
//         fn.call(this, evt.changedTouches[0] || evt.touches[0]);
//     };
// }

// function onResize () {
//     // resize the web canvas to the screen size
//     hpgButterfly.resize(window.innerWidth, window.innerHeight);
// }

// function loop () {
//     requestAnimationFrame(loop);
//     render();
// }

// function render () {
//     var newTime = +new Date() / 1000;
//     var deltaTime = newTime - time;
//     if (isMultiTouch) {
//         let from = touchEvents[multiTouchChargeToggle ? 0 : 1];
//         let to = touchEvents[multiTouchChargeToggle ? 1 : 0];
//         hpgButterfly.draw(from.x + (Math.random() - 0.5) * 0.1, from.y + (Math.random() - 0.5) * 0.1, to.x + (Math.random() - 0.5) * 0.1, to.y + (Math.random() - 0.5) * 0.1);
//         multiTouchChargeToggle = !multiTouchChargeToggle;
//     }

//     // pass delta time in second into the api
//     hpgButterfly.render(deltaTime);
//     time = newTime;
// }