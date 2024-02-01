import React, { useRef } from 'react';
import { getPublicAssetPath } from '../../../utils';
import './PosterBg.less';
import Popover from '../../../components/popover';
import YouTube from 'react-youtube';
import PosterDialog from '../../../components/dialog/PosterDialog';

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
                <div className="poster__point"></div>
            </PosterDialog>
        </>
    );
};
