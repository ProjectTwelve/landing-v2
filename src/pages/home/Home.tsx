import React, { useEffect, useRef, useState } from 'react';
import { HomeGL } from './components/HomeGL';
import { StyledHome } from './styled/StyledHome';

export const Home: React.FC = () => {
    // useEffect(() => {
    //     //宇宙特效
    //     var canvas = document.getElementById('canvas')! as any,
    //         ctx = canvas.getContext('2d'),
    //         w = (canvas.width = window.innerWidth),
    //         h = (canvas.height = window.innerHeight),
    //         hue = 255,
    //         stars = [] as any,
    //         count = 0,
    //         maxStars = 1; //星星数量,默认1300
    //     var canvas2 = document.createElement('canvas'),
    //         ctx2 = canvas2.getContext('2d') as any;
    //     canvas2.width = 100;
    //     canvas2.height = 100;
    //     var half = canvas2.width / 2,
    //         gradient2 = ctx2.createRadialGradient(
    //             half,
    //             half,
    //             0,
    //             half,
    //             half,
    //             half
    //         );
    //     gradient2.addColorStop(0.025, '#CCC');
    //     gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
    //     gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
    //     gradient2.addColorStop(1, 'transparent');

    //     ctx2.fillStyle = gradient2;
    //     ctx2.beginPath();
    //     ctx2.arc(half, half, half, 0, Math.PI * 2);
    //     ctx2.fill();

    //     // End cache
    //     function random(min, max?: any) {
    //         if (arguments.length < 2) {
    //             max = min;
    //             min = 0;
    //         }

    //         if (min > max) {
    //             var hold = max;
    //             max = min;
    //             min = hold;
    //         }

    //         return Math.floor(Math.random() * (max - min + 1)) + min;
    //     }

    //     function maxOrbit(x, y) {
    //         var max = Math.max(x, y),
    //             diameter = Math.round(Math.sqrt(max * max + max * max));
    //         return diameter / 2;
    //         //星星移动范围，值越大范围越小，
    //     }

    //     class Star {
    //         orbitRadius: any;
    //         radius: any;
    //         orbitX: any;
    //         orbitY: any;
    //         timePassed: any;
    //         speed: any;
    //         alpha: any;
    //         constructor() {
    //             this.orbitRadius = random(maxOrbit(w, h));
    //             this.radius = random(60, this.orbitRadius) / 10; //星星大小,值越大星星越小,默认8

    //             this.orbitX = w / 2;
    //             this.orbitY = h / 2;
    //             this.timePassed = random(0, maxStars);
    //             this.speed = 0; //星星移动速度,值越大越慢,默认5W

    //             this.alpha = random(2, 10) / 10;

    //             count++;
    //             stars[count] = this;
    //         }

    //         draw() {
    //             var x =
    //                     Math.sin(this.timePassed) * this.orbitRadius +
    //                     this.orbitX,
    //                 y =
    //                     Math.cos(this.timePassed) * this.orbitRadius +
    //                     this.orbitY,
    //                 twinkle = random(10);

    //             if (twinkle === 1 && this.alpha > 0) {
    //                 this.alpha -= 0.05;
    //             } else if (twinkle === 2 && this.alpha < 1) {
    //                 this.alpha += 0.05;
    //             }

    //             ctx.globalAlpha = this.alpha;
    //             ctx.drawImage(
    //                 canvas2,
    //                 x - this.radius / 2,
    //                 y - this.radius / 2,
    //                 this.radius,
    //                 this.radius
    //             );
    //             this.timePassed += this.speed;
    //         }
    //     }

    //     for (var i = 0; i < maxStars; i++) {
    //         new Star();
    //     }

    //     function animation() {
    //         ctx.globalCompositeOperation = 'source-over';
    //         ctx.globalAlpha = 0.5; //尾巴
    //         ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)';
    //         ctx.fillRect(0, 0, w, h);

    //         ctx.globalCompositeOperation = 'lighter';
    //         for (var i = 1, l = stars.length; i < l; i++) {
    //             stars[i].draw();
    //         }

    //         window.requestAnimationFrame(animation);
    //     }

    //     animation();
    // }, []);

    useEffect(() => {
        var WINDOW_WIDTH = document.body.offsetWidth;
        var WINDOW_HEIGHT = document.body.offsetHeight;
        var canvas, context;
        var num = 100;
        var stars = [] as any[];
        var rnd;

        canvas = document.getElementById('canvas');
        canvas.width = WINDOW_WIDTH;
        canvas.height = WINDOW_HEIGHT;

        context = canvas.getContext('2d');

        addStar();
        setInterval(render, 33);
        liuxing();

        function liuxing() {
            var time = Math.round(Math.random() * 3000 + 33);
            setTimeout(function () {
                rnd = Math.ceil(Math.random() * stars.length);
                liuxing();
            }, time);
        }

        function render() {
            context.fillStyle = 'rgba(0,0,0,0.1)';
            context.fillRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
            // context.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT)
            for (var i = 0; i < num; i++) {
                var star = stars[i];
                if (i == rnd) {
                    star.vx = -2;
                    star.vy = 5;
                    context.beginPath();
                    context.strokeStyle =
                        'rgba(255,255,255,' + star.alpha + ')';
                    context.lineWidth = star.r;
                    context.moveTo(star.x, star.y);
                    context.lineTo(star.x + star.vx, star.y + star.vy);
                    context.stroke();
                    context.closePath();
                }
                star.alpha += star.ra;
                if (star.alpha <= 0) {
                    star.alpha = 0;
                    star.ra = -star.ra;
                    star.vx = Math.random() * 0.2 - 0.1;
                    star.vy = Math.random() * 0.2 - 0.1;
                } else if (star.alpha > 1) {
                    star.alpha = 1;
                    star.ra = -star.ra;
                }
                star.x += star.vx;
                if (star.x >= WINDOW_WIDTH) {
                    star.x = 0;
                } else if (star.x < 0) {
                    star.x = WINDOW_WIDTH;
                    star.vx = Math.random() * 0.2 - 0.1;
                    star.vy = Math.random() * 0.2 - 0.1;
                }
                star.y += star.vy;
                if (star.y >= WINDOW_HEIGHT) {
                    star.y = 0;
                    star.vy = Math.random() * 0.2 - 0.1;
                    star.vx = Math.random() * 0.2 - 0.1;
                } else if (star.y < 0) {
                    star.y = WINDOW_HEIGHT;
                }
                context.beginPath();
                var bg = context.createRadialGradient(
                    star.x,
                    star.y,
                    0,
                    star.x,
                    star.y,
                    star.r
                );
                bg.addColorStop(0, 'rgba(255,255,255,' + star.alpha + ')');
                bg.addColorStop(1, 'rgba(255,255,255,0)');
                context.fillStyle = bg;
                context.arc(star.x, star.y, star.r, 0, Math.PI * 2, true);
                context.fill();
                context.closePath();
            }
        }

        function addStar() {
            for (var i = 0; i < num; i++) {
                var aStar = {
                    x: Math.round(Math.random() * WINDOW_WIDTH),
                    y: Math.round(Math.random() * WINDOW_HEIGHT),
                    r: Math.random() * 2,
                    ra: Math.random() * 0.05,
                    alpha: Math.random(),
                    vx: Math.random() * 0.2 - 0.1,
                    vy: Math.random() * 0.2 - 0.1,
                };
                stars.push(aStar);
            }
        }
    }, []);
    return (
        <StyledHome>
            <canvas
                id='canvas'
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                }}
            ></canvas>
            <HomeGL />
        </StyledHome>
    );
};
