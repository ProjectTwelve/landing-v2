import { useMemo } from 'react';
import { NewInfoType } from '../../../../api/news/news.type';
import { P12_NEW_TYPE_LABEL } from '../../../../constants';
import { useFetchNewList, useNewDateFormat } from '../../../../hooks/news';
import { useIsPortrait } from '../../../../hooks/useIsPortrait';
import './NewList.less';

type NewListItemProps = {
    onClick: (newInfo: NewInfoType) => void;
    data: NewInfoType;
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
const NewListItem = ({ data, onClick }: NewListItemProps) => {
    const { title, imageUrl1, createTime, text, type } = data;
    const newDate = useNewDateFormat(createTime);
    return (
        <div className="social-new" onClick={() => onClick(data)}>
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
    const scrollDist = useMemo(() => (isPortrait ? 2.5 * rootSize : 402), [isPortrait, rootSize]);
    return (
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
