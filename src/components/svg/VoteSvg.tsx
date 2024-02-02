import classNames from 'classnames';

export function VoteSvg({
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
            width={size ?? 20}
            height={size ?? 20}
            viewBox="0 0 20 20"
            fill={color ?? 'current'}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.7646 0L-5.67645e-05 11.7647L2.45298 14.2177C3.38046 13.7752 4.52462 13.938 5.2927 14.7061C6.06078 15.4741 6.22355 16.6183 5.78102 17.5458L8.23524 20L19.9999 8.23529L17.5463 5.78164C16.6185 6.22516 15.4734 6.06265 14.7049 5.29412C13.9364 4.52558 13.7739 3.38051 14.2174 2.45274L11.7646 0ZM10.5881 5.8823L5.88223 10.5882L7.0587 11.7646L11.7646 7.05877L10.5881 5.8823ZM12.9408 8.23511L8.23487 12.941L9.41134 14.1175L14.1172 9.41158L12.9408 8.23511Z"
                fill="current"
            />
        </svg>
    );
}
