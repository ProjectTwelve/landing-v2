import React, { useRef, useEffect } from 'react';
import './PosterBg.less';
import { getPublicAssetPath } from '../../../utils';

export const PosterBg: React.FC = () => {
    const vidRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {}, []);

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
