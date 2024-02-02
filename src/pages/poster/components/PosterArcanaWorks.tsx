import { useAtomValue } from 'jotai';
import _ from 'lodash-es';
import { useEffect, useMemo } from 'react';
import Swiper from 'swiper';
import 'swiper/css';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import { useIsPortrait } from '../../../hooks/useIsPortrait';
import { premiumListAtom } from '../../../store/poster/state';
import ArcanaGame from './ArcanaGame';
import './PosterArcanaWorks.less';
Swiper.use([Autoplay, EffectCoverflow]);

export default function PosterArcanaWorks() {
    const data = useAtomValue(premiumListAtom);
    const premiumItems = useMemo(() => _.sampleSize(data, 6), [data]);
    const isPortrait = useIsPortrait();
    useEffect(() => {
        let arcanaSwiper = new Swiper('#arcana-game-swiper', {
            effect: 'coverflow',
            grabCursor: true,
            init: false,
            centeredSlides: true,
            loop: true,
            initialSlide: 2,
            slidesPerView: 'auto',
            autoplay: {
                delay: 2000,
                disableOnInteraction: true,
            },
            coverflowEffect: {
                rotate: 0,
                stretch: 3,
                depth: 100,
                modifier: 1,
                scale: 0.9,
                slideShadows: false,
            },
        });
        arcanaSwiper?.init();
        return () => {
            arcanaSwiper?.destroy();
        };
    }, [isPortrait]);
    return (
        <div className="poster-arcana-works">
            <h1>Featured Creations</h1>
            {/* {isLoading && <LoadingSvg color="white" className="poster-arcana-works__loading" />} */}
            <div id="arcana-game-swiper" className={'poster-arcana-works__swiper swiper'}>
                <div className="swiper-wrapper">
                    {premiumItems?.length
                        ? premiumItems.map((item) => <ArcanaGame className="swiper-slide" key={item.id} data={item} />)
                        : null}
                </div>
            </div>
        </div>
    );
}
