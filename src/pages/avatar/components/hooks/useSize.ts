import { useEffect, useState, MutableRefObject } from 'react';

export function useSize(elem: MutableRefObject<HTMLElement>) {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

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

        setTimeout(() => {
            obs.observe(elem.current);
        }, 100);
        return () => {
            obs.disconnect();
            console.log('observe effect cleanup');
        };
    }, []);

    return [width, height];
}
