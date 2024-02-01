import {
    FloatingFocusManager,
    FloatingOverlay,
    FloatingPortal,
    useClick,
    useDismiss,
    useFloating,
    useInteractions,
    useRole,
} from '@floating-ui/react';
import classNames from 'classnames';
import { ReactNode, cloneElement, memo, useEffect, useState } from 'react';
import './PosterDialog.less';

type DialogProps = {
    className?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    showCloseButton?: boolean;
    render: (props: { close: () => void }) => ReactNode;
    children?: JSX.Element;
    title?: string | JSX.Element;
    isDismiss?: boolean;
    headerClass?: string;
    titleClass?: string;
    closeArrowClass?: string;
};

function PosterDialog({
    className,
    render,
    open: passedOpen = false,
    children,
    title,
    showCloseButton = true,
    onOpenChange,
    isDismiss = true,
    headerClass,
    titleClass,
    closeArrowClass,
}: DialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const onChange = (status: boolean) => {
        setIsOpen(status);
        onOpenChange?.(status);
    };

    const { refs, context } = useFloating({ open: isOpen, onOpenChange: onChange });
    const { setReference, setFloating } = refs;
    const dismiss = useDismiss(context, { enabled: isDismiss, outsidePressEvent: 'mousedown' });

    const { getReferenceProps, getFloatingProps } = useInteractions([useClick(context), useRole(context), dismiss]);

    useEffect(() => {
        if (passedOpen === undefined) return;
        setIsOpen(passedOpen);
    }, [passedOpen]);

    return (
        <>
            {children && cloneElement(children, getReferenceProps({ ref: setReference, ...children.props }))}
            <FloatingPortal>
                {isOpen && (
                    <FloatingOverlay lockScroll className="poster__dialog-mask">
                        <FloatingFocusManager context={context}>
                            <div
                                className={classNames('poster__dialog', className)}
                                {...getFloatingProps({ ref: setFloating })}
                            >
                                <div className={classNames('poster__dialog-container', headerClass)}>
                                    <h1 className={titleClass}>{title}</h1>
                                </div>
                                {render({
                                    close: () => onChange(false),
                                })}
                            </div>
                        </FloatingFocusManager>
                    </FloatingOverlay>
                )}
            </FloatingPortal>
        </>
    );
}

export default memo(PosterDialog);
