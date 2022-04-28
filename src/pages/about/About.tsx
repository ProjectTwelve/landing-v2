import React, { useEffect, useRef, useState } from 'react';
import './About.less';
import classnames from 'classnames';
import { LOCATION_INFO } from './About.config';

export const About: React.FC = () => {
    const [currentPartner, setCurrentPartner] = useState(1);

    return (
        <div className='about'>
            <div className='about__info'>
                {LOCATION_INFO.map((info) => {
                    return (
                        <div
                            key={info.name}
                            className='about__info-item'
                            style={{ left: info.x, top: info.y }}
                        >
                            {info.img ? (
                                <img
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
                {[1, 2, 3].map((i) => {
                    return (
                        <div
                            key={i}
                            className={classnames(
                                'about__partner-item',
                                `about__partner-item--${i}`,
                                i === currentPartner && 'active'
                            )}
                            onClick={() => setCurrentPartner(i)}
                        ></div>
                    );
                })}
                <i className='about__partner-dot about__partner-dot--right'></i>
            </div>
            <div className='about__helper'>
                <div className='about__helper-item'>
                    <i className='about__dot about__dot--office'></i>
                    Office
                </div>
                <div className='about__helper-item'>
                    <i className='about__dot about__dot--remote'></i>
                    Remote
                </div>
                <div className='about__helper-item'>
                    <img
                        src={require('../../assets/about/origin-china.png')}
                        className='about__dot about__dot--origin'
                    ></img>
                    Origin
                </div>
            </div>
        </div>
    );
};
