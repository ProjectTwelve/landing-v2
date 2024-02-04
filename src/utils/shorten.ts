import { getAddress } from 'viem';

export function isAddress(value: any): string | false {
    try {
        return getAddress(value);
    } catch {
        return false;
    }
}

export function shortenAddress(address?: string, chars = 4): string {
    if (!address) return '';
    const parsed = isAddress(address);
    if (!parsed) {
        throw Error(`Invalid 'address' parameter '${address}'.`);
    }
    return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

export function shortenStr(
    str?: string,
    option?: {
        startTruncateLength?: number; // 开始省略的长度
        pre?: number;
        post?: number;
    },
): string {
    const { pre = 3, post = 5, startTruncateLength = 20 } = option ?? {};
    const len = str?.length;
    if (!len) return '';
    if (len < startTruncateLength) return str;
    return `${str.substring(0, pre)}...${str.substring(len - post)}`;
}

export function shortenShowName(showName?: string, startTruncateLength = 20): string {
    if (!showName) return '';
    const parsed = isAddress(showName);
    // TODO: shorten Rule
    if (parsed) return shortenAddress(showName);
    else if (showName.includes('.p12.dev')) return shortenStr(showName, { post: 3, startTruncateLength });
    else return shortenStr(showName, { startTruncateLength });
}

export function shortenNumber(value: number, digits: number = 4, startTruncateValue: number = 100_000): string {
    if (value < startTruncateValue) return value.toLocaleString('en-US');
    const k = { type: 'K', num: 1_000 };
    const m = { type: 'M', num: 1_000_000 };
    const b = { type: 'B', num: 1_000_000_000 };
    const t = { type: 'T', num: 1_000_000_000_000 };
    if (value < k.num * 100) {
        return value.toLocaleString('en-US');
    }
    if (value < m.num) {
        return (value / k.num).toPrecision(digits) + k.type;
    }
    if (value < b.num) {
        return (value / m.num).toPrecision(digits) + m.type;
    }
    if (value < t.num) {
        return (value / b.num).toPrecision(digits) + b.type;
    }
    return (value / t.num).toPrecision(digits) + t.type;
}
