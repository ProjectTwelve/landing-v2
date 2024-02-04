export type UserAndGameCountResult = {
    regUserCount: number;
    gamesCount: number;
    participantCount: number;
    votesCount: number;
};

export enum WORK_TYPE {
    PREMIUM = 'premium',
    MOBOX = 'mobox',
    LATEST = 'latest',
    DEFAULT = 'default',
}

export type P12GameInfo = {
    id: number;
    screenshots: string[];
    walletAddress: string;
    gameVotes: number;
    gameName: string;
    mainImage: string | null; // 主图
    gameDescription: string | null;
    showName: string | null;
    twitter: string | null; // 前面没有@
    mobox?: boolean;
    twitterVerify: boolean;
    pgeShow?: bigint;
    recommend?: boolean;
    rank?: number; // 投票为0不进排行榜
    weeklyRank?: number;
    weeklyVotes?: number;

    mwGameCode?: string;
};
