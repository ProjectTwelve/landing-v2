import { useEffect, useState, MutableRefObject } from 'react';

export function useSize(elem: MutableRefObject<HTMLElement>) {
    const [width, setWidth] = useState(512);
    const [height, setHeight] = useState(512);

    useEffect(() => {
        console.log('observe effect');

        const obs = new ResizeObserver((entries) => {
            // console.log(entries);
            if (entries[0].contentRect) {
                const newWidth = entries[0].contentRect.width;
                const newHeight = entries[0].contentRect.height;

                if (width !== newWidth) setWidth(newWidth);
                if (height !== newHeight) setHeight(newHeight);
            }
        });

        obs.observe(elem.current);
        return () => {
            obs.disconnect();
            console.log('observe effect cleanup');
        };
    }, []);

    return [width, height];
}
