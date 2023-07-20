import classNames from 'classnames';
import React from 'react';
import { createPortal } from 'react-dom';
import './Dialog.less';

type DialogProps = {
    open?: boolean;
    onClose?: () => void;
    children?: React.ReactNode; // replace title and content
    author?: string | React.ReactNode;
    title?: string | React.ReactNode;
    subtitle?: string | React.ReactNode;
    content?: string | React.ReactNode;
    extraHeader?: React.ReactNode;
    className?: string;
    id?: string;
};

const Dialog = ({ open, onClose, extraHeader, author, title, subtitle, content, className, children, id }: DialogProps) => {
    return createPortal(
        <div>
            <div
                className={classNames('dialog', { show: open }, className)}
                onWheel={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                }}
            >
                <div className={classNames('dialog__close', `${id}__close`)} onClick={onClose}></div>
                {extraHeader}
                {!children && (
                    <div
                        className={classNames('dialog__container', `${id}__container`)}
                        onWheel={(e) => {
                            const targetDom: Element = e.target as Element;
                            targetDom.scrollTop = targetDom.scrollTop + e.deltaY;
                        }}
                    >
                        <div className={classNames('dialog__header', `${id}__header`)}>
                            {author && <div className="dialog__header-left">{author}</div>}
                            <div className="dialog__header-right">
                                {title && <div className="dialog__title">{title}</div>}
                                {subtitle && <div className="dialog__subtitle">{subtitle}</div>}
                            </div>
                        </div>

                        {content && <div className={classNames('dialog__content', `${id}__content`)}>{content}</div>}
                    </div>
                )}
                {children}
            </div>
            <div className={classNames('mask', { show: open })}></div>
        </div>,
        document.body,
    );
};
Dialog.defaultProps = {
    open: false,
};
export default Dialog;
