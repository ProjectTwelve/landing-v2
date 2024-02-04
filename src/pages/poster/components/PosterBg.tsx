import { useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import PosterDialog from '../../../components/dialog/PosterDialog';
import Popover from '../../../components/popover';
import { getPublicAssetPath } from '../../../utils';
import PosterArcanaWorks from './PosterArcanaWorks';
import './PosterBg.less';
import PosterSummary from './PosterSummary';

export const PosterBg = ({ className }: { className?: string }) => {
    const vidRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        vidRef?.current?.play();
    }, []);
    return (
        <>
            <video
                ref={vidRef}
                className="poster-mobile-bg"
                src={getPublicAssetPath('files/vid/poster-bg.mp4')}
                muted
                loop
                playsInline
            ></video>
            <div className={className}>
                <PosterDialog render={() => <YouTube className="poster__video" videoId={'wZ5KAc-M4Oc'} />}>
                    <div className="poster__point" style={{ left: '0.5rem', bottom: '1.5rem' }}></div>
                </PosterDialog>
                <Popover placement="top" render={({ close }) => <PosterSummary />} hoverOpen>
                    <div className="poster__point" style={{ left: '2.05rem', bottom: '1.5rem' }}></div>
                </Popover>
                <PosterDialog render={({ close }) => <PosterArcanaWorks />}>
                    <div className="poster__point" style={{ left: '2.85rem', bottom: '3rem' }}></div>
                </PosterDialog>
            </div>
        </>
    );
};
