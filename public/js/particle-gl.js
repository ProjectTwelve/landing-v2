// https://openprocessing.org/sketch/2097742
/**
			slider_layout.js
				A slider with labels for its title and value.
				@param {string} label
				@param {number} minValue
				@param {number} maxValue
				@param {number} defaultValue
				@param {number} steps
				@param {number} posx
				@param {number} posy
				*/
function SliderLayout(label, minValue, maxValue, defaultValue, steps, posx, posy) {
    this.label = label;
    this.slider = createSlider(minValue, maxValue, defaultValue, steps);
    this.slider.position(posx, posy);

    this.display = function () {
        var sliderPos = this.slider.position();

        noStroke();
        fill(0);
        textSize(15);
        text(this.label, sliderPos.x, sliderPos.y - 10);

        fill(0);
        text(this.slider.value(), sliderPos.x + this.slider.width + 10, sliderPos.y + 10);
    };
}

let scaleRatio = 3;
let isAnimating = false;
/**
                              particle.js
                              A particle that uses a seek behaviour to move to its target.
                              @param {number} x
                              @param {number} y
                              */
function Particle(x, y) {
    this.pos = new p5.Vector(x, y);
    this.vel = new p5.Vector(0, 0);
    this.acc = new p5.Vector(0, 0);
    this.target = new p5.Vector(0, 0);
    this.isKilled = false;

    this.maxSpeed = random(0.25, 2); // How fast it can move per frame.
    this.maxForce = random(8, 15); // Its speed limit.

    this.currentColor = color(0);
    this.endColor = color(0);
    this.colorBlendRate = random(0.01, 0.05);

    this.currentSize = 0;

    // Saving as class var so it doesn't need to calculate twice.
    this.distToTarget = 0;

    this.move = function () {
        this.distToTarget = dist(this.pos.x, this.pos.y, this.target.x, this.target.y);

        // If it's close enough to its target, the slower it'll get
        // so that it can settle.
        if (this.distToTarget < closeEnoughTarget) {
            var proximityMult = this.distToTarget / closeEnoughTarget;
            this.vel.mult(0.9);
        } else {
            var proximityMult = 1;
            this.vel.mult(0.95);
        }

        // Steer towards its target.
        if (this.distToTarget > 1) {
            var steer = new p5.Vector(this.target.x, this.target.y);
            steer.sub(this.pos);
            steer.normalize();
            steer.mult(this.maxSpeed * proximityMult * speedSlider.slider.value());
            this.acc.add(steer);
        }

        let scaledMouseX = mouseX / scaleRatio;
        let scaledMouseY = mouseY / scaleRatio;

        var mouseDist = dist(this.pos.x, this.pos.y, scaledMouseX, scaledMouseY);

        // Interact with mouse.
        if (mouseDist < mouseSizeSlider.slider.value()) {
            if (mouseIsPressed) {
                // Push towards mouse.
                var push = new p5.Vector(scaledMouseX, scaledMouseY);
                push.sub(new p5.Vector(this.pos.x, this.pos.y));
            } else {
                // Push away from mouse.
                var push = new p5.Vector(this.pos.x, this.pos.y);
                push.sub(new p5.Vector(scaledMouseX, scaledMouseY));
            }
            push.normalize();
            push.mult((mouseSizeSlider.slider.value() - mouseDist) * 0.05);
            this.acc.add(push);
        }

        // Move it.
        this.vel.add(this.acc);
        this.vel.limit(this.maxForce * speedSlider.slider.value());
        this.pos.add(this.vel);
        this.acc.mult(0);
    };

    this.draw = function () {
        if (!isAnimating) return;
        this.currentColor = lerpColor(this.currentColor, this.endColor, this.colorBlendRate);
        stroke(this.currentColor);

        if (!this.isKilled) {
            // Size is bigger the closer it is to its target.
            var targetSize = map(
                min(this.distToTarget, closeEnoughTarget),
                closeEnoughTarget,
                0,
                0,
                particleSizeSlider.slider.value(),
            );
        } else {
            var targetSize = 2;
        }

        this.currentSize = lerp(this.currentSize, targetSize, 0.1);
        strokeWeight(this.currentSize);

        point(this.pos.x, this.pos.y);
    };

    this.kill = function () {
        if (!this.isKilled) {
            this.target = generateRandomPos(width / 2, height / 2, max(width, height));
            this.endColor = color(0);
            this.isKilled = true;
        }
    };

    this.isOutOfBounds = function () {
        return this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height;
    };
}

/**
    util.js
    Randomly uses an angle and magnitude from supplied position to get a new position.
    @param {number} x
    @param {number} y
    @param {number} mag
    @return {p5.Vector}
*/
function generateRandomPos(x, y, mag) {
    var pos = new p5.Vector(x, y);

    var randomDirection = new p5.Vector(random(width), random(height));

    var vel = p5.Vector.sub(randomDirection, pos);
    vel.normalize();
    vel.mult(mag);
    pos.add(vel);

    return pos;
}

/**
                                  Dynamically adds/removes particles to make up the next image.
                                  */
function nextImage() {
    // Switch index to next image.
    imgIndex++;
    if (imgIndex > imgs.length - 1) {
        imgIndex = 0;
    }
    imgs[imgIndex].loadPixels();

    // Create an array of indexes from particle array.
    var particleIndexes = [];
    for (var i = 0; i < allParticles.length; i++) {
        particleIndexes.push(i);
    }

    var pixelIndex = 0;

    // Go through each pixel of the image.
    for (var y = 0; y < imgs[imgIndex].height; y++) {
        for (var x = 0; x < imgs[imgIndex].width; x++) {
            // Get the pixel's color.
            var pixelR = imgs[imgIndex].pixels[pixelIndex];
            var pixelG = imgs[imgIndex].pixels[pixelIndex + 1];
            var pixelB = imgs[imgIndex].pixels[pixelIndex + 2];
            var pixelA = imgs[imgIndex].pixels[pixelIndex + 3];

            pixelIndex += 4;

            // Give it small odds that we'll assign a particle to this pixel.
            if (random(1.0) > loadPercentage * resSlider.slider.value()) {
                continue;
            }

            var pixelColor = color(pixelR, pixelG, pixelB);

            if (particleIndexes.length > 0) {
                // Re-use existing particle.
                var index = particleIndexes.splice(random(particleIndexes.length - 1), 1);
                var newParticle = allParticles[index];
            } else {
                // Create a new particle.
                var newParticle = new Particle(width / 2, height / 2);
                allParticles.push(newParticle);
            }

            newParticle.target.x = x + width / 2 - imgs[imgIndex].width / 2;
            newParticle.target.y = y + height / 2 - imgs[imgIndex].height / 2;
            newParticle.endColor = pixelColor;
        }
    }

    // Kill off any left over particles that aren't assigned to anything.
    if (particleIndexes.length > 0) {
        for (var i = 0; i < particleIndexes.length; i++) {
            allParticles[particleIndexes[i]].kill();
        }
    }
}

/*
    Particles to image

    Particles seek a target to make up an image. 
    They get bigger the closer they get to their target.

    Controls:
        - Move the mouse to interact.
        - Hold down the mouse button pull particles in.
        - Press any key to change to the next image.
        - Use the on-screen controls to change settings.

    Thank's for original Author: Jason Labbe - jasonlabbe3d.com
        
    Fork for a case study of an art instalation. j_espanca_bacelar 2020
*/

var imgs = [];
var imgNames = ['https://cdn1.p12.games/landing/p12-logo.png'];
var scaleNum = 0.37;
var imgIndex = -1;
var loadPercentage = 0.045; // 0 to 1.0
var closeEnoughTarget = 50;

var allParticles = [];

var mouseSizeSlider;
var particleSizeSlider;
var speedSlider;
var resSlider;

function preload() {
    // Pre-load all images.
    for (var i = 0; i < imgNames.length; i++) {
        var newImg = loadImage(imgNames[i]);
        newImg.resize(200, 200);
        imgs.push(newImg);
    }
}

function setup() {
    const canvas = createCanvas(420, 420);
    canvas.parent('particle-container');
    for (var i = 0; i < imgNames.length; i++) {
        imgs[i].resize(imgs[i].width * scaleNum, imgs[i].height * scaleNum);
    }

    // 选择容器元素并设置 MutationObserver 来监听 className 的变化
    const containerElement = document.getElementById('particle-container');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const currentClass = mutation.target.className;
                // 当 className 包含 'active' 时继续动画，否则停止
                isAnimating = currentClass.includes('active');
            }
            // 监听 data-scale 属性的变化
            if (mutation.attributeName === 'data-scale') {
                const newDataScale = mutation.target.getAttribute('data-scale');
                // 将 scaleRatio 设置为新的值，确保转换为数字类型
                scaleRatio = parseFloat(newDataScale);
            }
        });
    });
    observer.observe(containerElement, { attributes: true });
    // Create on-screen controls and attach them to the 'particle-control' div
    let controlsDiv = select('#particle-control'); // Select the div where the controls will be placed

    e = createElement('h3', 'Mouse Size').style('color', '#fff').parent(controlsDiv);
    e.position(105, 60);
    mouseSizeSlider = new SliderLayout('Mouse size', 10, 200, 50, 1, 100, 100);
    mouseSizeSlider.slider.parent(controlsDiv); // Make the slider a child of the controls div

    e = createElement('h3', 'Particle Size').style('color', '#fff').parent(controlsDiv);
    e.position(105, 130);
    particleSizeSlider = new SliderLayout('Particle size', 1, 20, 3, 1, 100, mouseSizeSlider.slider.position().y + 70);
    particleSizeSlider.slider.parent(controlsDiv);

    e = createElement('h3', 'Speed').style('color', '#fff').parent(controlsDiv);
    e.position(105, 200);
    speedSlider = new SliderLayout('Speed', 0, 5, 3, 0.5, 100, particleSizeSlider.slider.position().y + 70);
    speedSlider.slider.parent(controlsDiv);

    e = createElement('h3', 'Resolution').style('color', '#fff').parent(controlsDiv);
    e.position(105, 270);
    resSlider = new SliderLayout('Count multiplier (on next image)', 0.1, 2, 2, 0.1, 100, speedSlider.slider.position().y + 70);
    resSlider.slider.parent(controlsDiv);
    // Change to first image.
    nextImage();
}

function draw() {
    if (!isAnimating) return;
    background(0);

    for (var i = allParticles.length - 1; i > -1; i--) {
        allParticles[i].move();
        allParticles[i].draw();

        if (allParticles[i].isKilled) {
            if (allParticles[i].isOutOfBounds()) {
                allParticles.splice(i, 1);
            }
        }
    }

    // these are commented out, because they were visible in the screen capture
    // I used createElement commands so that they are not captured
    // Display slider labels.
    // mouseSizeSlider.display();
    // particleSizeSlider.display();
    // speedSlider.display();
    // resSlider.display();
}
