import classNames from 'classnames';
import './Dialog.less';
type DialogProps = {
    open?: boolean;
    onClose?: () => void;
    children?: React.ReactNode; // replace title and content
    cover?: string;
    coverLabel?: string | React.ReactNode;
    title?: string | React.ReactNode;
    subtitle?: string | React.ReactNode;
    content?: string | React.ReactNode;
    className?: string;
};
const Dialog = ({ open, onClose, title, subtitle, content, cover, coverLabel, className, children }: DialogProps) => {
    return (
        <>
            <div className={classNames('dialog', { show: open }, className)}>
                <div className="dialog__close" onClick={onClose}></div>
                {cover && (
                    <div className="dialog__cover">
                        {coverLabel}
                        <img src={cover} alt="cover" />
                    </div>
                )}
                {!children && (
                    <div
                        className="dialog__container"
                        onWheel={(e) => {
                            const targetDom: Element = e.target as Element;
                            e.preventDefault();
                            targetDom.scrollTop = targetDom.scrollTop + e.deltaY;
                        }}
                    >
                        {title && <div className="dialog__title">{title}</div>}
                        {subtitle && <div className="dialog__subtitle">{subtitle}</div>}
                        {content && <div className="dialog__content">{content}</div>}
                    </div>
                )}
                {children}
            </div>
            <div className={classNames('mask', { show: open })}></div>
        </>
    );
};
Dialog.defaultProps = {
    open: false,
};
export default Dialog;
