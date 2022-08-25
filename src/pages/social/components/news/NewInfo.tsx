import { NewInfoType } from '../../../../api/news/news.type';
// import './NewInfo.less';

type NewInfoProps = {
    newInfo: NewInfoType;
};
export const NewInfo = ({ newInfo }: NewInfoProps) => {
    // TODO: Modal
    const { title, text } = newInfo;
    return (
        <div className="social-news">
            NewInfo {title}
            <div dangerouslySetInnerHTML={{ __html: text }}></div>
        </div>
    );
};
