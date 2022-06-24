import {useAnchorWebapp} from '../../contexts/context';
import {createQueryFn} from '@libs/react-query-utils';
import {useQuery} from 'react-query';
import {ANCHOR_QUERY_KEY} from '../../env';
import {UST, xyz, HumanAddr} from '@anchor-protocol/types';
import {
    QueryClient,
    wasmFetch,
    WasmQuery,
    WasmQueryData,
} from '@libs/query-client';
import {
    useLunaExchange,
} from '@anchor-protocol/app-provider';
import big from 'big.js';

interface StateWasmQuery {
    state: WasmQuery<xyz.State, xyz.StateResponse<UST>>;
}

export type xyzState = WasmQueryData<StateWasmQuery>;

export async function xyzStateQuery(
    xyzAddr: HumanAddr,
    queryClient: QueryClient,
): Promise<xyzState | undefined> {
    return wasmFetch<StateWasmQuery>({
        ...queryClient,
        id: `state`,
        wasmQuery: {
            state: {
                contractAddress: xyzAddr,
                query: {
                    state: {},
                },
            },
        },
    });
}

export function useXyzStateQuery(): any[] | undefined {
    let deposits = [];
    const queryFn = createQueryFn(xyzStateQuery);
    const {queryClient, contractAddress, queryErrorReporter} =
        useAnchorWebapp();

    const xyzs = [
        {
            contract: contractAddress.moneyMarket.market,
            denom: "uusd"
        },
        {
            contract: contractAddress.moneyMarket.marketLuna,
            denom: "uluna"
        },
    ]
    for (const {contract, denom} of xyzs) {
        const result = useQuery(
            [
                "STATE",
                contract,
                queryClient,
            ],
            queryFn,
            {
                refetchInterval: 1000 * 60 * 2,
                enabled: true,
                keepPreviousData: true,
                onError: queryErrorReporter,
            },
        );
        if (result.data) deposits.push({
            denom,
            state: result.data.state,
        });
    }

    return deposits.length ? deposits : undefined;
}

export function useTvl() {
    let xyzStates = useXyzStateQuery();
    let lunaUustExchangeRate = useLunaExchange();
    let totalTvlAsUST = big(0);
    let lunaTvl = "";
    let lunaTvlAsUST = "";
    let ustTvl = "";
    if (xyzStates) {
        for (const {denom, state} of xyzStates) {
            if (state)
            switch (denom) {
                case "uluna":
                        const lunaTvlUST = lunaUustExchangeRate.mul(big(state.tvl).div(big(1000000)).toNumber());
                        lunaTvlAsUST = lunaTvlUST.toFixed(5);
                        totalTvlAsUST = totalTvlAsUST.add(lunaTvlUST)
                    break;
                case "uusd":
                        const ust = big(state.tvl).div(big(1000000));
                        ustTvl = ust.toFixed(5);
                        totalTvlAsUST = totalTvlAsUST.add(ust);
                    break;
            }
        }
    }

    return {
        lunaTvl,
        lunaTvlAsUST,
        ustTvl,
        totalTvlAsUST: totalTvlAsUST.toFixed(5),
    };
}
