import classNames from 'classnames';
import './SocialItem.less';
type CollabSocialsProps = {
    href?: string; // url
    icon: string | JSX.Element;
    title?: string; // title for the link
    desc?: string; // description for the link
    className?: string;
    onClick?: () => void;
};

export function SocialItem({ href, title, desc, icon, className, onClick }: CollabSocialsProps) {
    return (
        <div onClick={onClick} className={classNames('social-item', className)}>
            <a href={href} target="_blank">
                {typeof icon === 'string' ? <img src={icon} className="social-item__icon" alt={title || 'icon'}></img> : icon}{' '}
            </a>
            <div className="social-item__content">
                {title && <div className="social-item__content-title">{title}</div>}
                {desc && <div className="social-item__content-desc">{desc}</div>}
            </div>
        </div>
    );
}
