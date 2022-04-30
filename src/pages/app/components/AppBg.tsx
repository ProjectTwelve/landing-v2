import React, { useRef, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import './AppBg.less';

export const AppBg: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        let CONTAINER_WIDTH = container.offsetWidth;
        let CONTAINER_HEIGHT = container.offsetHeight;
        let num = Math.ceil(CONTAINER_WIDTH / 19);
        let stars = [] as any[];
        let meteorIndex1;
        let meteorIndex2;
        let meteorTimeId: number;
        let rafId: number;

        const canvas = document.createElement('canvas');
        canvas.width = CONTAINER_WIDTH;
        canvas.height = CONTAINER_HEIGHT;
        container.appendChild(canvas);

        const observer = new ResizeObserver(() => {
            CONTAINER_WIDTH = container.offsetWidth;
            CONTAINER_HEIGHT = container.offsetHeight;
            num = Math.ceil(CONTAINER_WIDTH / 19);
            canvas.width = CONTAINER_WIDTH;
            canvas.height = CONTAINER_HEIGHT;
            stars = [];
            addStar();
        });
        observer.observe(container);

        const context = canvas.getContext('2d')!;

        addStar();
        setMeteorIndex();
        render();

        return () => {
            cancelAnimationFrame(rafId);
            clearTimeout(meteorTimeId);
            observer.disconnect();
            container.removeChild(canvas);
        };

        function setMeteorIndex() {
            const time = Math.round(Math.random() * 3000 + 33);
            meteorTimeId = window.setTimeout(function () {
                meteorIndex1 = Math.ceil(Math.random() * stars.length);
                meteorIndex2 = Math.ceil(Math.random() * stars.length);
                setMeteorIndex();
            }, time);
        }

        function render() {
            context.fillStyle = 'rgba(0,0,0,0.1)';
            context.fillRect(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT);
            for (let i = 0; i < num; i++) {
                const star = stars[i];
                if (i === meteorIndex1 || i === meteorIndex2) {
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
                if (star.x >= CONTAINER_WIDTH) {
                    star.x = 0;
                } else if (star.x < 0) {
                    star.x = CONTAINER_WIDTH;
                    star.vx = Math.random() * 0.2 - 0.1;
                    star.vy = Math.random() * 0.2 - 0.1;
                }
                star.y += star.vy;
                if (star.y >= CONTAINER_HEIGHT) {
                    star.y = 0;
                    star.vy = Math.random() * 0.2 - 0.1;
                    star.vx = Math.random() * 0.2 - 0.1;
                } else if (star.y < 0) {
                    star.y = CONTAINER_HEIGHT;
                }
                context.beginPath();
                const bg = context.createRadialGradient(
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

            rafId = requestAnimationFrame(render);
        }

        function addStar() {
            for (let i = 0; i < num; i++) {
                const aStar = {
                    x: Math.round(Math.random() * CONTAINER_WIDTH),
                    y: Math.round(Math.random() * CONTAINER_HEIGHT),
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

    return <div className='app-bg' ref={containerRef} />;
};
