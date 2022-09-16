export const SENTRY_DSN =
    process.env.SENTRY_DSN || 'https://21e709d4697149bdada12707651ac95a@o1375249.ingest.sentry.io/6687523';

export const SENTRY_TRACES_SAMPLE_RATE = 0.2;

export const P12_API_PREFIX = process.env.REACT_APP_P12_API_PREFIX || 'https://news.p12.games';

export const P12_AUTHOR_AVATOR = {
    dongbo: 'https://cdn1.p12.games/p12-news/LWKDfU6Vyj56Y8Mf',
};

export enum P12_NEW_TYPE_LABEL {
    Collab = '#43BBFF',
    Announcement = '#1EDB8C',
    Game = '#C859FF',
}
