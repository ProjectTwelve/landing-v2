import classnames from 'classnames';
import { useCallback, useEffect, useMemo } from 'react';
import Swiper from 'swiper';
import { Autoplay, EffectFade } from 'swiper/modules';
import { PageBadges, PageType } from '../../App.config';
import './index.less';

type BadgeProps = {
    current: PageType;
};
Swiper.use([Autoplay, EffectFade]);
const Badge = ({ current }: BadgeProps) => {
    const currentBadges = useMemo(() => {
        if (!current || !PageBadges[current]?.length) return [];
        return PageBadges[current];
    }, [current]);
    const initSwiper = useCallback(() => {
        let swiper = new Swiper('.badge-swiper-container', {
            autoplay: {
                delay: 3000,
            },
            init: false,
            loop: true,
            mousewheel: false,
            effect: 'fade',
            fadeEffect: {
                crossFade: true,
            },
        });
        return swiper;
    }, []);

    useEffect(() => {
        let swiper = initSwiper();
        swiper?.init();
        return () => swiper?.destroy();
    }, [current]);

    return (
        <div className="badge-wrap">
            <div className="badge-circle"></div>
            <div className="badge-swiper-container swiper">
                <div className="swiper-wrapper">
                    {currentBadges.map((v, i) => (
                        <img
                            key={v}
                            src={require(`../../../../assets/app/badges/badge-h${v}@2x.png`)}
                            alt={i}
                            className={classnames('swiper-slide badge-icon')}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Badge;
