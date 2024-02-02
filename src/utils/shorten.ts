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
