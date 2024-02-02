import { useQuery } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { fetchUserAndGameCount } from '../../api/p12';
import { posterSummaryAtom } from '../../store/poster/state';

export const useFetchUserAndGameCount = () => {
    const setPosterSummary = useSetAtom(posterSummaryAtom);

    return useQuery(['fetch_user_and_game_count'], () => fetchUserAndGameCount(), {
        select: ({ code, data }) => {
            const result = code === 200 ? data : undefined;
            setPosterSummary(result);
            return result;
        },
    });
};
