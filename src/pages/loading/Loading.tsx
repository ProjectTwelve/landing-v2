import gsap from 'gsap';
import React, { useRef } from 'react';
import { GAevent } from '../../utils';
import { PageType } from '../app/App.config';
import { loadingEE, usePageVisible } from '../app/App.utils';
import './Loading.less';
import { LoadingGL } from './components/LoadingGL';

const loadingProgressObj = { num: 0 };

export const Loading: React.FC = () => {
    const progressTextRef = useRef<HTMLSpanElement>(null);
    let tween: gsap.core.Tween;

    usePageVisible(PageType.Loading, () => {
        const handleProgress = (progress, dur = 0.6) => {
            tween?.kill();
            tween = gsap.to(loadingProgressObj, {
                duration: dur,
                num: progress * 100,
                onUpdate: function () {
                    progressTextRef.current!.innerHTML = `${Math.floor(loadingProgressObj.num)}`;
                },
            });
        };

        return {
            onVisible: () => {
                GAevent('webview', 'loadin-webview');
                handleProgress(0.6, 1);
                loadingEE.on('loaded', () => handleProgress(1, 1));
                gsap.set('.page-wrap-loading', {
                    display: 'block',
                    opacity: 1,
                });
            },
            onHide: () => {
                loadingEE.off('loaded');
                gsap.to('.page-wrap-loading', {
                    duration: 2.4,
                    display: 'none',
                    opacity: 0,
                    ease: 'power1.inOut',
                });
            },
            onDestroy: () => {},
        };
    });

    return (
        <div className="loading">
            <LoadingGL />
            <div className="loading__rotate">
                Please rotate to horizontal
                <br /> to experience P12 site
            </div>
            <div className="loading__progress">
                <div className="loading__progress-dot loading__progress-dot--1"></div>
                <div className="loading__progress-dot loading__progress-dot--2"></div>
                <div className="loading__progress-dot loading__progress-dot--3"></div>
                <div className="loading__progress-text">
                    <span ref={progressTextRef}>0</span>%
                </div>
                <div className="loading__progress-dot loading__progress-dot--4"></div>
                <div className="loading__progress-dot loading__progress-dot--5"></div>
                <div className="loading__progress-dot loading__progress-dot--6"></div>
            </div>
            <div className="loading__logo">
                <img id="loading-icon" src={require('../../assets/loading/loading-icon.png')} alt="P12" />
            </div>
        </div>
    );
};
