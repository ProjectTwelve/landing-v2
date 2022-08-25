import { useCallback, useState } from 'react';
import { GAevent } from '../../utils';
import { PageType } from '../app/App.config';
import { usePageVisible } from '../app/App.utils';
import gsap from 'gsap';
import './Social.less';
import { ButterflyGL } from '../../components/butterfly-gl/ButterflyGL';
import { SocialItem } from './components/SocialItem';
import { NewList } from './components/news/NewList';
import { NewInfo } from './components/news/NewInfo';
import { NewInfoType } from '../../api/news/news.type';
export const Social: React.FC = () => {
    const [newModalOpen, setOpen] = useState(false);
    const [newInfo, setNewInfo] = useState<NewInfoType | null>(null);

    const openNewInfoModal = useCallback(
        (newInfo: NewInfoType) => {
            setNewInfo(newInfo);
            setOpen(true);
        },
        [newModalOpen, setOpen, setNewInfo],
    );

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
            {/* <ButterflyGL page={PageType.Social} /> */}
            <div className="social__wrapper">
                <div className="social__title-sub">P12 COMMUNITY</div>
                <div className="social__title">For gamers and developers</div>
                <div className="social__item-container">
                    <SocialItem
                        onClick={() => GAevent('event', 'Soc-discord')}
                        href="https://discord.com/invite/EMrbsZPbxs"
                        icon={require('../../assets/app/icon-twitter@2x.png')}
                        title="Discord"
                        desc="Ask questions and engage."
                    />
                    <SocialItem
                        onClick={() => GAevent('event', 'Soc-twi')}
                        href="https://twitter.com/_p12_"
                        icon={require('../../assets/app/icon-discord@2x.png')}
                        title="Twitter"
                        desc="Follow the latest news."
                    />
                    <SocialItem
                        onClick={() => GAevent('event', 'Soc-tele')}
                        href="https://mirror.xyz/p12.eth"
                        icon={require('../../assets/app/icon-mirror@2x.png')}
                        title="Mirror"
                        desc="Balabbbaala."
                    />
                </div>
                <div className="social__title-sub">NEWS</div>
                <div className="social__title">Wonderful occurs</div>
                {newModalOpen && newInfo && <NewInfo newInfo={newInfo} />}
                <NewList onItemClick={openNewInfoModal} />
            </div>
        </div>
    );
};
