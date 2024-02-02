import React, { useRef } from 'react';
import { getPublicAssetPath } from '../../../utils';
import './PosterBg.less';
import Popover from '../../../components/popover';
import YouTube from 'react-youtube';
import PosterDialog from '../../../components/dialog/PosterDialog';
import PosterSummary from './PosterSummary';
import PosterArcanaWorks from './PosterArcanaWorks';

export const PosterBg: React.FC = () => {
    const vidRef = useRef<HTMLVideoElement>(null);

    return (
        <>
            <video
                ref={vidRef}
                className="poster-mobile-bg"
                src={getPublicAssetPath('files/vid/poster-bg.mp4')}
                muted
                loop
                autoPlay
                playsInline
            ></video>
            <PosterDialog render={() => <YouTube className="poster__video" videoId={'wZ5KAc-M4Oc'} />}>
                <div className="poster__point" style={{ left: '0.5rem', bottom: '1.5rem' }}></div>
            </PosterDialog>
            <Popover placement="top" render={({ close }) => <PosterSummary />} hoverOpen>
                <div className="poster__point" style={{ left: '2.05rem', bottom: '2rem' }}></div>
            </Popover>
            <Popover placement="top" render={({ close }) => <PosterArcanaWorks />} hoverOpen>
                <div className="poster__point" style={{ left: '3rem', bottom: '1rem' }}></div>
            </Popover>
        </>
    );
};
