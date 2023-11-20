import gsap from 'gsap';
import { useCallback, useState } from 'react';
import { NewInfoType } from '../../api/news/news.type';
import { ButterflyGL } from '../../components/butterfly-gl/ButterflyGL';
import { usePageLockScroll } from '../../hooks/usePageLockScroll';
import { GAevent, requestOrientationPermission } from '../../utils';
import { PageType } from '../app/App.config';
import { usePageVisible } from '../app/App.utils';
import './Social.less';
import { SocialItem } from './components/SocialItem';
import NewInfoDialog from './components/news/NewInfoDialog';
import { NewList } from './components/news/NewList';

export const Social: React.FC = () => {
    const [newModalOpen, setOpen] = useState(false);
    const [isVisible, setVisible] = useState(false);

    const [newInfo, setNewInfo] = useState<NewInfoType | null>(null);

    usePageLockScroll(newModalOpen); // 弹窗时阻止滚动

    const openNewInfoModal = useCallback(
        (newInfo: NewInfoType) => {
            setNewInfo(newInfo);
            setOpen(true);
        },
        [newModalOpen, setOpen, setNewInfo],
    );

    const closeNewInfoModal = useCallback(() => {
        setNewInfo(null);
        setOpen(false);
    }, [newModalOpen, setOpen, setNewInfo]);

    usePageVisible(PageType.Social, () => {
        return {
            onVisible: () => {
                requestOrientationPermission();
                const tl = gsap.timeline();
                setVisible(true);
                tl.fromTo(
                    '.page-wrap-social',
                    {
                        opacity: 0,
                    },
                    {
                        duration: 0.5,
                        display: 'block',
                        opacity: 1,
                    },
                );
                return tl.then();
            },
            onHide: () => {
                setVisible(false);
                const tl = gsap.timeline();
                tl.fromTo(
                    '.page-wrap-social',
                    {
                        display: 'block',
                        opacity: 1,
                    },
                    {
                        duration: 0.5,
                        display: 'none',
                        opacity: 0,
                    },
                );
                return tl.then();
            },
        };
    });

    return (
        <div className={`social ${isVisible ? undefined : ' hidden'}`}>
            <ButterflyGL page={PageType.Social} />
            <div
                className="social__wrapper"
                onWheel={(e) => {
                    const social = e.currentTarget;
                    if (social?.scrollTop !== 0) {
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                    }
                }}
            >
                <div className="social__community">
                    <div className="social__title">{'community & links'}</div>
                    <div className="social__community-container">
                        <SocialItem
                            className="discord"
                            onClick={() => GAevent('event', 'Soc-discord')}
                            href="https://discord.com/invite/EMrbsZPbxs"
                            icon={require('../../assets/social/discord.png')}
                            title="Discord"
                        />
                        <SocialItem
                            className="twitter"
                            onClick={() => GAevent('event', 'Soc-twi')}
                            href="https://twitter.com/_p12_"
                            icon={require('../../assets/social/twitter.png')}
                            title="Twitter"
                        />
                        <SocialItem
                            className="mirror"
                            onClick={() => GAevent('event', 'Soc-tele')}
                            href="https://mirror.xyz/p12.eth"
                            icon={require('../../assets/social/mirror.png')}
                            title="Mirror"
                        />
                        <SocialItem
                            className="youtube"
                            href="https://www.youtube.com/@_p12_"
                            icon={require('../../assets/social/youtube.png')}
                            title="Youtube"
                        />
                        <SocialItem
                            className="assets"
                            href="https://assets.p12.games/"
                            icon={require('../../assets/social/assets.png')}
                            title="Assets"
                        />
                        <SocialItem
                            className="badge"
                            href="https://galaxy.eco/P12/"
                            icon={require('../../assets/social/badge.png')}
                            title="Badge"
                        />
                    </div>
                </div>
                <div className="social__news">
                    <div className="social__title">latest</div>
                    <NewList onItemClick={openNewInfoModal} />
                    <NewInfoDialog newInfo={newInfo} open={newModalOpen} onClose={closeNewInfoModal} />
                </div>
            </div>
        </div>
    );
};
