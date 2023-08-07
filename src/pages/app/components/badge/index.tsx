import classnames from 'classnames';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import Swiper from 'swiper';
import { Autoplay, EffectFade } from 'swiper/modules';
import { PageBadges, PageType } from '../../App.config';
import './index.less';
import _ from 'lodash-es';

type BadgeProps = {
    current: PageType;
};
Swiper.use([Autoplay, EffectFade]);
const Badge = ({ current }: BadgeProps) => {
    const currentDefaultBadge = useMemo(() => {
        if (!current || !PageBadges[current]) return null;
        return PageBadges[current];
    }, [current]);
    const swiperRef = useRef<Swiper | null>(null);
    const intervalId = useRef<NodeJS.Timer | null>(null);

    const initSwiper = useCallback(() => {
        let swiper = new Swiper('.badge-swiper-container', {
            autoplay: false,
            init: false,
            loop: true,
            mousewheel: false,
            effect: 'fade',
            fadeEffect: {
                crossFade: true,
            },
            initialSlide: currentDefaultBadge ? currentDefaultBadge - 1 : 0, // 设置初始项
        });
        swiperRef.current = swiper;
        return swiper;
    }, [currentDefaultBadge]);

    // 自动切换
    const switchSlide = () => {
        if (!swiperRef?.current) return;
        let nextSlide;
        do {
            nextSlide = _.random(0, 17);
        } while (nextSlide === swiperRef.current.activeIndex); // 确保下一个随机项与当前项不同
        swiperRef.current.slideTo(nextSlide);
    };

    useEffect(() => {
        let swiper = initSwiper();
        swiper?.init();
        // 第一项停留 8 秒，之后的项每 3 秒切换一次
        const timeoutId = setTimeout(() => {
            switchSlide();
            intervalId.current = setInterval(switchSlide, 3000); // 存储定时器 ID
        }, 8000);

        return () => {
            swiper?.destroy();
            clearTimeout(timeoutId); // 清除定时器
            if (intervalId?.current) clearInterval(intervalId.current); // 清除定时器
        };
    }, [current]);

    // 点击切换
    const handleClick = () => {
        let nextSlide;
        do {
            nextSlide = _.random(0, 17);
        } while (nextSlide === swiperRef.current?.activeIndex); // 确保下一个随机项与当前项不同
        swiperRef.current?.slideTo(nextSlide);
        if (intervalId?.current) clearInterval(intervalId.current); // 重置定时器
        intervalId.current = setInterval(switchSlide, 3000);
    };
    return (
        <div className="badge-wrap" onClick={handleClick}>
            <div className="badge-circle"></div>
            <div className="badge-swiper-container swiper">
                <div className="swiper-wrapper">
                    {/* badge 1 - badge 18 */}
                    {_.range(1, 19).map((v, i) => (
                        <img
                            key={v}
                            src={require(`../../../../assets/app/badges/badge-h${v}@2x.png`)}
                            alt={`badge${i}`}
                            className={classnames('swiper-slide badge-icon')}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Badge;
