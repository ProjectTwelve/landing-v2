export type NewsStatus = 'NEW' | 'PUBLISH' | 'OFFLINE';
export type NewInfoType = {
    id: number;
    status: NewsStatus;
    text: string;
    newsCode: string;
    title: string;
    imageUrl1?: string;
    imageUrl2?: string;
    author: string;
    createTime: number;
    updateTime: number;
};
