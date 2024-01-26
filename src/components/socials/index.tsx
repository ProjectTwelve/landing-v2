import TwitterSrc from '../../assets/app/x.svg';
import MirrorSrc from '../../assets/app/icon-mirror@2x.png';
import DiscordSrc from '../../assets/app/icon-discord@2x.png';
import './index.less';
import classNames from 'classnames';

const socialLinks = [
    {
        name: 'mirror',
        iconSrc: MirrorSrc,
        href: 'https://mirror.xyz/p12.eth',
    },
    {
        name: 'twitter',
        iconSrc: TwitterSrc,
        href: 'https://twitter.com/_p12',
    },
    {
        name: 'discord',
        iconSrc: DiscordSrc,
        href: 'https://discord.com/invite/EMrbsZPbxs',
    },
];
export const Socials = ({ className }: { className?: string }) => {
    return (
        <div className={classNames('social-links', className)}>
            {socialLinks.map(({ name, iconSrc, href }) => (
                <a href={href} key={name} target="_blank">
                    <img src={iconSrc} alt={name} />
                </a>
            ))}
        </div>
    );
};
