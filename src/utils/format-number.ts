export function formatNumber(x: number) {
    return new Intl.NumberFormat("en-US").format(x);
}