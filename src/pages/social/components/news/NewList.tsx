import classNames from 'classnames';
import { useMemo } from 'react';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { NewInfoType } from '../../../../api/types/mars';
import { PinSvg } from '../../../../components/svg/PinSvg';
import { P12_NEW_TYPE_LABEL } from '../../../../constants';
import { useFetchNewList, useNewDateFormat } from '../../../../hooks/news';
import { useIsPortrait } from '../../../../hooks/useIsPortrait';
import { PageType } from '../../../app/App.config';
import { usePageVisible } from '../../../app/App.utils';
import './NewList.less';
Swiper.use([Autoplay, EffectCoverflow, Pagination]);

type NewListItemProps = {
    onClick: (newInfo: NewInfoType) => void;
    data: NewInfoType;
    className?: string;
};
export const NewLabel = ({ type }) => {
    return (
        <div
            className="social-new__label"
            style={{
                color: P12_NEW_TYPE_LABEL[type],
                backgroundColor: `${P12_NEW_TYPE_LABEL[type]}33`,
                borderColor: P12_NEW_TYPE_LABEL[type],
            }}
        >
            {type}
        </div>
    );
};
const NewListItem = ({ data, onClick, className }: NewListItemProps) => {
    const { title, imageUrl1, createTime, text, type, showOrder } = data;
    const newDate = useNewDateFormat(createTime);
    return (
        <div className={classNames('social-new', className)} onClick={() => onClick(data)}>
            {showOrder ? (
                <div className="social-new__pin">
                    Pin <PinSvg />
                </div>
            ) : null}
            <div className="social-new__cover">
                <img src={imageUrl1} alt="cover" />
            </div>
            <div className="social-new__content">
                <div className="social-new__content-header">
                    <div className="social-new__content-header__title">{title}</div>
                    <NewLabel type={type} />
                </div>
                <div className="social-new__content-desc">
                    <div dangerouslySetInnerHTML={{ __html: text }}></div>
                </div>
                <div className="social-new__content-subtitle">{newDate}</div>
            </div>
        </div>
    );
};
type NewListProps = {
    onItemClick: (newInfo: NewInfoType) => void;
};
export const NewList = ({ onItemClick }: NewListProps) => {
    const { data: newList, isLoading } = useFetchNewList();
    const rootSize = useMemo(() => {
        const fontSize = parseFloat(document.documentElement.style.fontSize);
        return isNaN(fontSize) ? 16 : fontSize;
    }, [document.documentElement.style.fontSize]);
    const isPortrait = useIsPortrait();
    const scrollDist = useMemo(() => (isPortrait ? 2.67 * rootSize : 402), [isPortrait, rootSize]);

    const { pinList, restList } = useMemo(() => {
        if (!newList?.length)
            return {
                pinList: [],
                restList: [],
            };
        return {
            pinList: newList.filter((item) => item.showOrder),
            restList: newList.filter((item) => !item.showOrder),
        };
    }, [newList]);

    usePageVisible(PageType.Social, () => {
        let newsSwiper;
        if (isPortrait) {
            newsSwiper = new Swiper('#new-swiper', {
                effect: 'coverflow',
                grabCursor: true,
                init: false,
                centeredSlides: true,
                slidesPerView: 'auto',
                loop: true,
                initialSlide: 0,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: true,
                },
                coverflowEffect: {
                    rotate: 0,
                    stretch: -20,
                    depth: 80,
                    modifier: 1,
                },
                pagination: {
                    el: '.swiper-pagination',
                },
            });
        }
        return {
            onVisible: () => {
                newsSwiper?.init();
            },
            onDestroy: () => {
                newsSwiper?.destroy();
            },
        };
    });

    return (
        <>
            {/* Prevent rotating back to the rotator in landscape error */}
            <div className={classNames('social-news', { 'f-clip-hidden': !isPortrait })}>
                <div id="new-swiper" className={'social-news-list swiper'}>
                    <div className="swiper-wrapper">
                        {pinList?.length
                            ? pinList.map((item) => (
                                  <NewListItem className="swiper-slide" onClick={onItemClick} data={item} key={item.newsCode} />
                              ))
                            : null}
                        {restList?.length
                            ? restList.map((item) => (
                                  <NewListItem className="swiper-slide" onClick={onItemClick} data={item} key={item.newsCode} />
                              ))
                            : null}
                    </div>
                    <div className="swiper-pagination"></div>
                </div>
            </div>
            <div className={classNames('social-news', { 'f-clip-hidden': isPortrait })}>
                <div
                    className="social-pre"
                    onClick={() => {
                        const list = document?.querySelector('#new-scroll-container');
                        if (!newList?.length || !list) return;
                        const scrollLeft = list.scrollLeft === 0 ? newList?.length * scrollDist : list.scrollLeft - scrollDist;
                        list.scroll({
                            left: scrollLeft,
                            behavior: 'smooth',
                        });
                    }}
                >
                    <i className="social-next-icon"></i>
                </div>
                {isLoading && <div>Loading...</div>}
                <div id="new-scroll-container" className="social-news-list">
                    {pinList?.length
                        ? pinList.map((item) => <NewListItem onClick={onItemClick} data={item} key={item.newsCode} />)
                        : null}
                    {restList?.length
                        ? restList.map((item) => <NewListItem onClick={onItemClick} data={item} key={item.newsCode} />)
                        : null}
                </div>
                <div
                    className="social-next"
                    onClick={() => {
                        const list = document?.querySelector('#new-scroll-container');
                        if (!list) return;
                        const innerWidth = list.scrollWidth - list.clientWidth;
                        const isEnd = innerWidth - list.scrollLeft < 10;
                        const scrollLeft = isEnd ? 0 : list.scrollLeft + scrollDist;
                        list.scroll({
                            left: scrollLeft,
                            behavior: 'smooth',
                        });
                    }}
                >
                    <i className="social-next-icon"></i>
                </div>
            </div>
        </>
    );
};
