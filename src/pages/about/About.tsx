import React, { useEffect, useRef, useState } from 'react';
import './About.less';
import classnames from 'classnames';
import { ABOUT_PARTNERS, LOCATION_INFO } from './About.config';
import { usePageVisible } from '../app/App.utils';
import { PageType } from '../app/App.config';
import { GAevent } from '../../utils';
import gsap from 'gsap';

export const About: React.FC = () => {
    const [currentPartner, setCurrentPartner] = useState(0);

    usePageVisible(PageType.About, () => {
        return {
            onVisible: () => {
                GAevent('webview','Team-webview');
                const tl = gsap.timeline();
                tl.fromTo(
                    '.page-wrap-about',
                    {
                        opacity: 0,
                    },
                    {
                        duration: 0.5,
                        display: 'block',
                        opacity: 1,
                    }
                );
                return tl.then();
            },
            onHide: () => {
                const tl = gsap.timeline();
                tl.fromTo(
                    '.page-wrap-about',
                    {
                        display: 'block',
                        opacity: 1,
                    },
                    {
                        duration: 0.5,
                        display: 'none',
                        opacity: 0,
                    }
                );
                return tl.then();
            },
        };
    });

    return (
        <div className='about'>
            <div className='about__info'>
                {LOCATION_INFO.map((info, i) => {
                    return (
                        <div
                            key={info.name + i}
                            className='about__info-item'
                            style={{ left: info.x, top: info.y }}
                        >
                            {info.img ? (
                                <img
                                    alt='origin'
                                    className={classnames(
                                        'about__dot',
                                        `about__dot--${info.type}`
                                    )}
                                    src={info.img}
                                />
                            ) : (
                                <i
                                    className={classnames(
                                        'about__dot',
                                        `about__dot--${info.type}`
                                    )}
                                >
                                    <b
                                        style={{
                                            animationDelay: `${
                                                Math.random() * -2
                                            }s`,
                                        }}
                                    ></b>
                                </i>
                            )}

                            <span
                                className={classnames(
                                    'about__info-name',
                                    `about__info-name--${info.namePosition}`,
                                    `about__info-name--${info.type}`
                                )}
                            >
                                {info.name}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className='about__partner'>
                <i className='about__partner-dot about__partner-dot--left'></i>
                {ABOUT_PARTNERS.map((v, i) => {
                    return (
                        <div
                            key={i}
                            className={classnames(
                                'about__partner-item',
                                `about__partner-item--${i + 1}`,
                                i === currentPartner && 'active'
                            )}
                            onClick={() => setCurrentPartner(i)}
                        >
                            <img src={v.img} alt='avatar' />
                            <div className='about__partner-text'>
                                <div className='about__partner-text-name'>
                                    {v.name}
                                </div>
                                <div className='about__partner-text-desc'>
                                    {v.desc}
                                </div>
                                <div className='about__partner-text-links'>
                                    {!!v.links.linkedin && (
                                        <a
                                            className='about__partner-text-link about__partner-text-link--linkedin'
                                            href={v.links.linkedin}
                                            target='_blank'
                                            rel='noreferrer'
                                        ></a>
                                    )}
                                    {!!v.links.twitter && (
                                        <a
                                            className='about__partner-text-link about__partner-text-link--twitter'
                                            href={v.links.twitter}
                                            target='_blank'
                                            rel='noreferrer'
                                        ></a>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <i className='about__partner-dot about__partner-dot--right'></i>
            </div>
            <div className='about__helper'>
                <div className='about__helper-item'>
                    <i className='about__dot about__dot--headquarter'></i>
                    Headquarters
                </div>
                <div className='about__helper-item'>
                    <i className='about__dot about__dot--presence'></i>
                    Presence
                </div>
                <div className='about__helper-item'>
                    <img
                        alt='origin'
                        src={require('../../assets/about/origin-helper.png')}
                        className='about__dot about__dot--origin'
                    ></img>
                    Origin
                </div>
            </div>
        </div>
    );
};
