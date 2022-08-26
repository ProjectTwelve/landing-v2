import { NewInfoType } from '../../../../api/news/news.type';
import Dialog from '../../../../components/dialog/Dialog';
import { P12_AUTHOR_AVATOR } from '../../../../constants';
import { useNewDateFormat } from '../../../../hooks/news';
import './NewInfoDialog.less';
import { NewLabel } from './NewList';

type NewInfoDialogProps = {
    newInfo: NewInfoType | null;
    open?: boolean;
    onClose?: () => void;
};
const NewInfoDialog = ({ newInfo, open, onClose }: NewInfoDialogProps) => {
    const newDate = useNewDateFormat(newInfo?.createTime);
    return (
        <Dialog
            open={open}
            onClose={onClose}
            className="new-dialog"
            cover={newInfo?.imageUrl1}
            coverLabel={<NewLabel type={newInfo?.type} />}
            title={newInfo?.title}
            subtitle={
                <div className="new-dialog__subtitle">
                    <img src={P12_AUTHOR_AVATOR[newInfo?.author || 'dongbo']} alt={newInfo?.author} />
                    {newDate}
                </div>
            }
            content={newInfo?.text && <div dangerouslySetInnerHTML={{ __html: newInfo?.text }}></div>}
        ></Dialog>
    );
};
export default NewInfoDialog;
