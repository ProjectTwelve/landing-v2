import gsap from 'gsap';
import React, { useEffect, useState } from 'react';
import { useIsPortrait } from '../../hooks/useIsPortrait';
import { GAevent, requestOrientationPermission } from '../../utils';
import { PageType } from '../app/App.config';
import { usePageVisible } from '../app/App.utils';
import { FEATURED_ON_DATA, INVESTORS_DATA, PARTNERS_DATA } from './Wall.config';
import './Wall.less';

export const Wall: React.FC = () => {
    const [isVisible, setVisible] = useState(false);
    const isPortrait = useIsPortrait();
    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(
            '.page-wrap-wall',
            {
                display: 'block',
                opacity: 1,
            },
            {
                duration: 0.5,
                display: 'none',
                opacity: 0,
            },
        );
        return () => {
            tl.then();
        };
    }, []);

    usePageVisible(PageType.Wall, () => {
        return {
            onVisible: () => {
                setVisible(true);
                document.getElementById('particle-container')?.classList.add('active');
                GAevent('webview', 'Partners-webview');
                requestOrientationPermission();
                const tl = gsap.timeline();
                tl.fromTo(
                    '.page-wrap-wall',
                    {
                        opacity: 0,
                    },
                    {
                        duration: 0.5,
                        display: 'block',
                        opacity: 1,
                    },
                );
                return tl.then();
            },
            onHide: () => {
                setVisible(false);
                document.getElementById('particle-container')?.classList.remove('active');
                const tl = gsap.timeline();
                tl.fromTo(
                    '.page-wrap-wall',
                    {
                        display: 'block',
                        opacity: 1,
                    },
                    {
                        duration: 0.5,
                        display: 'none',
                        opacity: 0,
                    },
                );
                return tl.then();
            },
        };
    });
    return (
        <div className={`wall ${isVisible ? null : ' hidden'}`}>
            <div id="particle-container">
                <div className="particle-mask"></div>
            </div>

            <div className="wall__info">
                <div className="wall__title-1">Investors</div>
                <div className="wall__dot-1"></div>
                <div className="wall-partners">
                    {isPortrait
                        ? INVESTORS_DATA.map((arr) =>
                              arr.map(({ name, href, logo, mobileStyle }) => (
                                  <img
                                      style={mobileStyle}
                                      src={logo}
                                      key={name}
                                      alt={name}
                                      onClick={() => {
                                          if (href) window.open(href, '_blank');
                                      }}
                                  />
                              )),
                          )
                        : INVESTORS_DATA.map((arr, idx) => (
                              <div className="wall-partners__row" key={idx}>
                                  {arr.map(({ name, href, logo, style }) => (
                                      <img
                                          style={style}
                                          src={logo}
                                          key={name}
                                          alt={name}
                                          onClick={() => {
                                              if (href) window.open(href, '_blank');
                                          }}
                                      />
                                  ))}
                              </div>
                          ))}
                </div>
                <div className="wall__title-1">Partners</div>
                <div className="wall__dot-1"></div>
                <div className="wall-partners">
                    {isPortrait
                        ? PARTNERS_DATA.map((arr) =>
                              arr.map(({ name, href, logo, mobileStyle }) => (
                                  <img
                                      style={mobileStyle}
                                      src={logo}
                                      key={name}
                                      alt={name}
                                      onClick={() => {
                                          if (href) window.open(href, '_blank');
                                      }}
                                  />
                              )),
                          )
                        : PARTNERS_DATA.map((arr, idx) => (
                              <div className="wall-partners__row" key={idx}>
                                  {arr.map(({ name, href, logo, style }) => (
                                      <img
                                          style={style}
                                          src={logo}
                                          key={name}
                                          alt={name}
                                          onClick={() => {
                                              if (href) window.open(href, '_blank');
                                          }}
                                      />
                                  ))}
                              </div>
                          ))}
                </div>
                <div className="wall__title-2">Media</div>
                <div className="wall__dot-2"></div>
                <div className="wall__featured-on">
                    {FEATURED_ON_DATA.map((item, index) => {
                        return <div key={item.name} className={`wall__featured-on-${index + 1} wall__featured-on-item`}></div>;
                    })}
                </div>

                <div className="wall__media_btn">
                    <a href="https://p12.dev/brand" target="_blank" rel="noreferrer">
                        media kit
                    </a>
                </div>
            </div>
        </div>
    );
};
