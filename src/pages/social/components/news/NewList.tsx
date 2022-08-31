import { NewInfoType } from '../../../../api/news/news.type';
import { P12_NEW_TYPE_LABEL } from '../../../../constants';
import { useFetchNewList, useNewDateFormat } from '../../../../hooks/news';
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
                <NewLabel type={type} />
                <div className="social-new__content-title">{title}</div>
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
    return (
        <>
            <div className="social-news">
                {isLoading && <div>Loading...</div>}
                <div className="social-news-list">
                    {newList?.length
                        ? newList.map((item) => <NewListItem onClick={onItemClick} data={item} key={item.newsCode} />)
                        : null}
                </div>
            </div>
        </>
    );
};
