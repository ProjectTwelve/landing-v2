'use client';
import classNames from 'classnames';
import { useMemo, useRef } from 'react';
import { P12GameInfo } from '../../../api/types/p12';
import Popover from '../../../components/popover';
import { TwitterVerifySvg } from '../../../components/svg/TwitterVerifySvg';
import { useFileType } from '../../../hooks/p12/useFileType';
import { openLink } from '../../../utils';
import { shortenShowName } from '../../../utils/shorten';
import './ArcanaGame.less';

type ArcanaGameProps = {
    data?: P12GameInfo;
    className?: string;
};
export default function ArcanaGame({ data, className }: ArcanaGameProps) {
    const { mainImage, gameName, gameDescription, showName, id, twitter, twitterVerify, walletAddress } = data ?? {};
    const fileType = useFileType(mainImage ?? '');
    const videoRef = useRef<HTMLVideoElement>(null);

    const realShowName = useMemo(() => shortenShowName(showName ?? walletAddress), [showName, walletAddress]);

    const onClick = () => {
        openLink(`https://arcana.p12.games/?gameId=${data?.id}`);
    };

    return (
        <div
            onClick={onClick}
            className={classNames('arcana-game', className)}
            onMouseEnter={() => {
                if (videoRef.current) {
                    videoRef.current.play().catch(() => {});
                }
            }}
            onMouseLeave={() => {
                if (videoRef.current) {
                    videoRef.current.pause();
                }
            }}
        >
            <div className="arcana-game__corner">Featured</div>
            <div className="arcana-game__top">
                {fileType === 'video' ? (
                    <video ref={videoRef} className="arcana-game__cover" src={mainImage ?? ''} loop muted />
                ) : (
                    <img className="arcana-game__cover" loading="lazy" src={mainImage ?? ''} alt="gallery" />
                )}
            </div>
            <div className="arcana-game__bottom">
                <div className="arcana-game__bottom-extra">
                    <h3>{gameName}</h3>
                    <p>ID:{id}</p>
                </div>
                <div className="arcana-game__bottom-title">
                    <h3>By {realShowName}</h3>
                    {twitter ? (
                        <a href={'https://twitter.com/' + twitter} target="_blank">
                            <span>@{twitter}</span>
                            {twitterVerify && (
                                <Popover render={() => <p>Verified Creator</p>} hoverOpen>
                                    <TwitterVerifySvg />
                                </Popover>
                            )}
                        </a>
                    ) : null}
                </div>
                <p className="arcana-game__bottom-desc">{gameDescription}</p>
            </div>
        </div>
    );
}
