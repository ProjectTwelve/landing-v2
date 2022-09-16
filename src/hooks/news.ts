import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchNewList } from '../api/news';
import dayjs from 'dayjs';

export const useFetchNewList = () => {
    return useQuery(['fetch_new_list'], () => fetchNewList(), {
        select: (data) => (data ? data : []),
    });
};

export const useNewDateFormat = (unixTime?: number) => {
    return useMemo(() => {
        if (!unixTime) return null;
        return dayjs(unixTime).format('MMM DD, YYYY');
    }, [unixTime]);
};
