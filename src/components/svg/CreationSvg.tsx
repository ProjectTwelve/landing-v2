import classNames from 'classnames';

export function CreationSvg({
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
            viewBox="0 0 20 20"
            fill={color ?? 'current'}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.9231 19.2308H18.0769V4.61538L14.2308 0.769226H1.9231V19.2308ZM11.1538 6.15385V9.23077H14.2308V11.5385H11.1538V14.6154H8.84615V11.5385H5.76923V9.23077H8.84615L8.84615 6.15385H11.1538Z"
                fill="current"
            />
        </svg>
    );
}
