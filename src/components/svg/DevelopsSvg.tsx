import classNames from 'classnames';

export function DevelopsSvg({
    className,
    size,
    color,
    onClick,
}: {
    className?: string;
    size?: number;
    color?: string;
    onClick?: () => void;
}) {
    return (
        <svg
            onClick={onClick}
            className={classNames(className)}
            width={size ?? 16}
            height={size ?? 16}
            viewBox="0 0 20 18"
            fill={color ?? 'current'}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M20 0.5H0V9.5H20V0.5Z" fill="white" />
            <path d="M20 11.5H0V13.5H8V16H4V17.5H16V16H12V13.5H20V11.5Z" fill="current" />
        </svg>
    );
}
