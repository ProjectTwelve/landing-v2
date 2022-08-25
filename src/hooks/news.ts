import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchNewInfo, fetchNewList } from '../api/news';
import dayjs from 'dayjs';

export const useFetchNewList = () => {
    return useQuery(['fetch_new_list'], () => fetchNewList(), {
        select: (data) => (data ? data : []),
    });
};

export const useFetchNewInfo = (newsCode) => {
    return useQuery(['fetch_new_list', newsCode], () => fetchNewInfo(newsCode), {
        enabled: !!newsCode,
        select: (data) => (data ? data : null),
    });
};

export const useNewDateFormat = (unixTime: number) => {
    return useMemo(() => {
        return dayjs(unixTime).format('MMM DD, YYYY');
    }, [unixTime]);
};
