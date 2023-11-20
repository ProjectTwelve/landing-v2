import classNames from 'classnames';
import './SocialItem.less';

type CollabSocialsProps = {
    href?: string; // url
    icon: string | JSX.Element;
    title?: string; // title for the link
    className?: string;
    onClick?: () => void;
};

export function SocialItem({ href, title, icon, className, onClick }: CollabSocialsProps) {
    return (
        <div
            onClick={() => {
                onClick?.();
                window.open(href, '_blank');
            }}
            className={classNames('social-item', className)}
        >
            <div className="social-item__icon">
                {typeof icon === 'string' ? <img src={icon} alt={title || 'icon'}></img> : icon}
            </div>
            <div className="social-item__content">{title && <div className="social-item__content-title">{title}</div>}</div>
        </div>
    );
}
