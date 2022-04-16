import React, { useEffect, useRef, useState } from 'react';
import './About.less';
import classnames from 'classnames';

const LOCATION_INFO = [
    {
        type: 'office',
        name: 'Shanghai',
        x: 1612,
        y: 737,
        namePosition: 'right',
    },
    {
        type: 'office',
        name: 'Hangzhou',
        x: 1591,
        y: 754,
        namePosition: 'left',
    },
    {
        type: 'office',
        name: 'Singapore',
        x: 1563,
        y: 905,
        namePosition: 'left',
    },
    {
        type: 'remote',
        name: 'Berkeley,CA',
        x: 267,
        y: 651,
        namePosition: 'left',
    },
    {
        type: 'remote',
        name: 'Los Angeles,CA',
        x: 295,
        y: 714,
        namePosition: 'left',
    },
    {
        type: 'remote',
        name: 'Charpel Hill,NC',
        x: 519,
        y: 623,
        namePosition: 'right',
    },
    {
        type: 'remote',
        name: 'Penang',
        x: 1489,
        y: 865,
        namePosition: 'left',
    },
    {
        type: 'remote',
        name: 'Korea',
        x: 1706,
        y: 672,
        namePosition: 'left',
    },
];

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
                            <i
                                className={classnames(
                                    'about__dot',
                                    `about__dot--${info.type}`
                                )}
                            >
                                <b
                                    style={{
                                        animationDelay: `${Math.random() * 2}s`,
                                    }}
                                ></b>
                            </i>
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
            </div>
        </div>
    );
};
