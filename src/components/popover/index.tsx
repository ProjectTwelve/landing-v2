import {
    FloatingArrow,
    FloatingFocusManager,
    Placement,
    arrow,
    autoUpdate,
    flip,
    offset,
    shift,
    useClick,
    useDismiss,
    useFloating,
    useHover,
    useInteractions,
    useRole,
} from '@floating-ui/react';
import classNames from 'classnames';
import React, { cloneElement, useEffect, useRef, useState } from 'react';
import './index.less';

type PopoverProps = {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    render: (data: { close: () => void }) => React.ReactNode;
    placement?: Placement;
    children: React.JSX.Element;
    className?: string;
    offset?: number;
    hoverOpen?: boolean;
};

function Popover({
    children,
    render,
    open: passedOpen,
    placement,
    onOpenChange,
    className,
    offset: offsetNum,
    hoverOpen,
}: React.PropsWithChildren<PopoverProps>) {
    const [isOpen, setIsOpen] = useState(passedOpen);

    const arrowRef = useRef(null);

    useEffect(() => {
        if (passedOpen === undefined) return;
        setIsOpen(passedOpen);
    }, [passedOpen]);

    const onChange = (status: boolean) => {
        setIsOpen(status);
        onOpenChange?.(status);
    };

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        transform: false,
        onOpenChange: onChange,
        placement,
        middleware: [
            offset(offsetNum ?? 10),
            flip({ fallbackAxisSideDirection: 'end' }),
            shift(),
            arrow({ element: arrowRef }), // 添加箭头中间件
        ],
        whileElementsMounted: autoUpdate,
    });

    const { setReference, setFloating } = refs;
    const { getReferenceProps, getFloatingProps } = useInteractions([
        useHover(context, { enabled: hoverOpen, restMs: 20, delay: { close: 60 } }),
        useClick(context),
        useDismiss(context),
        useRole(context),
    ]);

    return (
        <>
            {cloneElement(children, getReferenceProps({ ref: setReference, ...children.props }))}
            {isOpen && (
                <FloatingFocusManager context={context} modal={false}>
                    <div
                        className={classNames('p12-popover', className)}
                        style={{ ...floatingStyles }}
                        {...getFloatingProps({ ref: setFloating })}
                    >
                        {render({ close: () => onChange(false) })}
                        <FloatingArrow fill="#00000066" ref={arrowRef} context={context} className="p12-popover__arrow" />
                    </div>
                </FloatingFocusManager>
            )}
        </>
    );
}

export default React.memo(Popover);
