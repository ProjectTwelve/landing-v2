import React, { useRef } from 'react';
import { getPublicAssetPath } from '../../../utils';
import './PosterBg.less';

export const PosterBg: React.FC = () => {
    const vidRef = useRef<HTMLVideoElement>(null);

    return (
        <video
            ref={vidRef}
            className="poster-mobile-bg"
            src={getPublicAssetPath('files/vid/poster-bg.mp4')}
            muted
            loop
            autoPlay
            playsInline
        ></video>
    );
};
