import { useEffect, useMemo } from 'react';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { NewInfoType } from '../../../../api/news/news.type';
import { P12_NEW_TYPE_LABEL } from '../../../../constants';
import { useFetchNewList, useNewDateFormat } from '../../../../hooks/news';
import { useIsPortrait } from '../../../../hooks/useIsPortrait';
import { PageType } from '../../../app/App.config';
import { usePageVisible } from '../../../app/App.utils';
import './NewList.less';
import classNames from 'classnames';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
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
    const { title, imageUrl1, createTime, text, type } = data;
    const newDate = useNewDateFormat(createTime);
    return (
        <div className={classNames('social-new', className)} onClick={() => onClick(data)}>
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
    useEffect(() => {
        let newsSwiper;
        if (isPortrait) {
            newsSwiper = new Swiper('.social-news-list', {
                effect: 'coverflow',
                grabCursor: true,
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
        return () => {
            newsSwiper?.destroy();
        };
    }, []);
    return isPortrait ? (
        <div className="social-news">
            <div className="social-news-list swiper">
                <div className="swiper-wrapper">
                    {newList?.length
                        ? newList.map((item) => (
                              <NewListItem className="swiper-slide" onClick={onItemClick} data={item} key={item.newsCode} />
                          ))
                        : null}
                </div>
                <div className="swiper-pagination"></div>
            </div>
        </div>
    ) : (
        <div className="social-news">
            <div
                className="social-pre"
                onClick={() => {
                    const list = document?.querySelector('.social-news-list');
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
            <div className="social-news-list">
                {newList?.length
                    ? newList.map((item) => <NewListItem onClick={onItemClick} data={item} key={item.newsCode} />)
                    : null}
            </div>
            <div
                className="social-next"
                onClick={() => {
                    const list = document?.querySelector('.social-news-list');
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
    );
};
