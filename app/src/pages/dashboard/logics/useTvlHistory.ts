import {
    useXyzTvlHistories,
    useXyzTvlHistoriesUST,
    useXyzTvlHistoriesLuna
} from '@anchor-protocol/app-provider';

export function useTvlHistory() {
    const data = useXyzTvlHistories();
    return data;
}
export function useTvlHistoryLuna() {
    const data = useXyzTvlHistoriesLuna();
    return data;
}
export function useTvlHistoryUST() {
    const data = useXyzTvlHistoriesUST();
    return data;
}
