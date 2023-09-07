export type NewsStatus = 'NEW' | 'PUBLISH' | 'OFFLINE';
export type NewsType = 'Collab' | 'Announcement' | 'Game';
export type NewInfoType = {
    id: number;
    status: NewsStatus;
    type: NewsType;
    text: string;
    newsCode: string;
    title: string;
    imageUrl1?: string;
    imageUrl2?: string;
    author: string;
    createTime: number;
    updateTime: number;
    showOrder?: number;
};
