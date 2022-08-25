import { NewInfoType } from '../../../../api/news/news.type';
import { useFetchNewList, useNewDateFormat } from '../../../../hooks/news';
import './NewList.less';

type NewListItemProps = {
    onClick: (newInfo: NewInfoType) => void;
    data: NewInfoType;
};
const NewListItem = ({ data, onClick }: NewListItemProps) => {
    const { title, imageUrl1, createTime, text } = data;
    const newDate = useNewDateFormat(createTime);
    return (
        <div className="social-new" onClick={() => onClick(data)}>
            <div className="social-new__cover">
                <img src={imageUrl1} alt="cover" />
            </div>
            <div className="social-new__content">
                <div className="social-new__content-title">{title}</div>
                <div className="social-new__content-subtitle">{newDate}</div>
                <div className="social-new__content-desc">{text}</div>
            </div>
        </div>
    );
};
type NewListProps = {
    onItemClick: (newInfo: NewInfoType) => void;
};
export const NewList = ({ onItemClick }: NewListProps) => {
    const { data: newList, isLoading } = useFetchNewList();
    return (
        <>
            <div className="social-news">
                <div
                    className="social-pre"
                    onClick={() => {
                        const list = document?.querySelector('.social-news-list');
                        if (!list) return;
                        console.log('list scrollLeft', list.scrollLeft);
                        list.scroll({
                            left: list.scrollLeft - 300,
                            behavior: 'smooth',
                        });
                        console.log('list scrollLeft', list.scrollLeft);
                    }}
                >
                    <i className="social-next-icon"></i>
                </div>
                {isLoading && <div>Loading...</div>}
                {
                    <div className="social-news-list">
                        {newList?.length
                            ? newList.map((item) => <NewListItem onClick={onItemClick} data={item} key={item.newsCode} />)
                            : null}
                    </div>
                }
                <div
                    className="social-next"
                    onClick={() => {
                        const list = document?.querySelector('.social-news-list');
                        if (!list) return;
                        console.log('list scrollLeft', list.scrollLeft);
                        list.scroll({
                            left: list.scrollLeft + 300,
                            behavior: 'smooth',
                        });
                        console.log('list scrollLeft', list.scrollLeft);
                    }}
                >
                    <i className="social-next-icon"></i>
                </div>
            </div>
        </>
    );
};
