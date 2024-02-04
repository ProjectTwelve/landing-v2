import classNames from 'classnames';
import { useAtomValue } from 'jotai';
import _ from 'lodash-es';
import { useEffect, useMemo } from 'react';
import Swiper from 'swiper';
import 'swiper/css';
import { FreeMode } from 'swiper/modules';
import { useIsPortrait } from '../../../hooks/useIsPortrait';
import { premiumListAtom } from '../../../store/poster/state';
import ArcanaGame from './ArcanaGame';
import './PosterArcanaWorks.less';

Swiper.use([FreeMode]);

export default function PosterArcanaWorks() {
    const data = useAtomValue(premiumListAtom);
    const premiumItems = useMemo(() => _.shuffle(data), [data]);
    const isPortrait = useIsPortrait();
    useEffect(() => {
        let arcanaSwiper = new Swiper('#arcana-game-swiper', {
            centeredSlides: true,
            loop: true,
            slidesPerView: 'auto',
            freeMode: { enabled: true, minimumVelocity: 0.001, momentumBounceRatio: 1.2 },
            spaceBetween: 20,
        });

        return () => {
            arcanaSwiper?.destroy();
        };
    }, []);

    return (
        <div className="poster-arcana-works">
            <h1>Featured Creations</h1>
            <div
                id="arcana-game-swiper"
                className={classNames('poster-arcana-works__swiper swiper', {
                    'f-clip-hidden': !isPortrait,
                })}
            >
                <div className="swiper-wrapper">
                    {premiumItems?.length
                        ? premiumItems.map((item) => <ArcanaGame className="swiper-slide" key={item.id} data={item} />)
                        : null}
                </div>
            </div>
            {!isPortrait && (
                <div className={classNames('poster-arcana-works__swiper')}>
                    {premiumItems?.length ? premiumItems.map((item) => <ArcanaGame key={item.id} data={item} />) : null}
                </div>
            )}
        </div>
    );
}
