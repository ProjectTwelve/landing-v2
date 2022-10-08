import { useCallback, useState } from 'react';
import { GAevent } from '../../utils';
import { PageType } from '../app/App.config';
import { usePageVisible } from '../app/App.utils';
import gsap from 'gsap';
import './Social.less';
import { ButterflyGL } from '../../components/butterfly-gl/ButterflyGL';
import { SocialItem } from './components/SocialItem';
import { NewList } from './components/news/NewList';
import NewInfoDialog from './components/news/NewInfoDialog';
import { NewInfoType } from '../../api/news/news.type';
import { usePageLockScroll } from '../../hooks/usePageLockScroll';

export const Social: React.FC = () => {
    const [newModalOpen, setOpen] = useState(false);
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
                const tl = gsap.timeline();
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
        <div className="social">
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
                <div className="social__title">COMMUNITY</div>
                <div className="social__title-sub">Empowering metaworlds</div>
                <div className="social__item-container">
                    <SocialItem
                        className="discord"
                        onClick={() => GAevent('event', 'Soc-discord')}
                        href="https://discord.com/invite/EMrbsZPbxs"
                        icon={require('../../assets/social/discord.png')}
                        title="Discord"
                        desc="Engage in the community."
                    />
                    <SocialItem
                        className="twitter"
                        onClick={() => GAevent('event', 'Soc-twi')}
                        href="https://twitter.com/_p12_"
                        icon={require('../../assets/social/twitter.png')}
                        title="Twitter"
                        desc="Stay tuned for newest events."
                    />
                    <SocialItem
                        className="mirror"
                        onClick={() => GAevent('event', 'Soc-tele')}
                        href="https://mirror.xyz/p12.eth"
                        icon={require('../../assets/social/mirror.png')}
                        title="Mirror"
                        desc="Release notes and major updates."
                    />
                </div>
                <div className="social__title">NEWS</div>
                <div className="social__title-sub">Save you a little time in this rapid changing space</div>
                <NewList onItemClick={openNewInfoModal} />
                <NewInfoDialog newInfo={newInfo} open={newModalOpen} onClose={closeNewInfoModal} />
            </div>
        </div>
    );
};
