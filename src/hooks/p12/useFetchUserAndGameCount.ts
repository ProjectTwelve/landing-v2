import { useQuery } from '@tanstack/react-query';
import { fetchUserAndGameCount } from '../../api/p12';

export const useFetchUserAndGameCount = () => {
    return useQuery(['fetch_user_and_game_count'], () => fetchUserAndGameCount(), {
        select: ({ code, data }) => {
            return code === 200 ? data : undefined;
        },
    });
};
