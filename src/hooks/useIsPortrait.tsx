import { useMediaQuery } from 'react-responsive';

export const useIsPortrait = () => {
    return useMediaQuery({ orientation: 'portrait' });
};
