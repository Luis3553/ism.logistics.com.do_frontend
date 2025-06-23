export function toISOString(date: Date) {
    // Dominican Republic is UTC-4, so offset is -4 * 60 * 60000 = -14400000
    // getTimezoneOffset() returns positive for zones behind UTC, so for UTC-4 it returns 240
    const tzoffset = -4 * 60 * 60000;
    const localISOTime = new Date(date.getTime() - tzoffset).toISOString();
    return localISOTime;
}
