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
import {LCDClient} from "@terra-money/terra.js"
import {
    useNetwork,
} from '@anchor-protocol/app-provider';


interface DepositorWasmQuery {
    depositor: WasmQuery<xyz.Depositor, xyz.DepositorResponse<UST>>;
}

export type xyzDepositor = WasmQueryData<DepositorWasmQuery>;

export async function xyzDepositorQuery(
    xyzAddr: HumanAddr,
    walletAddr: HumanAddr,
    queryClient: QueryClient,
): Promise<xyzDepositor | undefined> {
    const epoch = Math.floor(Date.now() / 1000);
    if (!walletAddr) {
        return undefined;
    }

    return wasmFetch<DepositorWasmQuery>({
        ...queryClient,
        id: `depositor?address=${walletAddr}`,
        wasmQuery: {
            depositor: {
                contractAddress: xyzAddr,
                query: {
                    ident: {
                        address: walletAddr,
                        epoch: epoch,
                    },
                },
            },
        },
    });
}

export function useXyzDepositorQuery(walletAddress: HumanAddr): any[] | undefined {
    let deposits = [];
    const queryFn = createQueryFn(xyzDepositorQuery);
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
                ANCHOR_QUERY_KEY.ANC_BALANCE,
                contract,
                walletAddress,
                queryClient,
            ],
            queryFn,
            {
                refetchInterval: !!walletAddress && 1000 * 60 * 2,
                enabled: !!walletAddress,
                keepPreviousData: true,
                onError: queryErrorReporter,
            },
        );
        if (result.data) deposits.push({
            denom,
            depositor: result.data.depositor,
        });
    }
    console.log(deposits)

    return deposits.length ? deposits : undefined;
}

export const useExchangeRates = () => {
    const {network} = useNetwork();
    const {queryErrorReporter} =
        useAnchorWebapp();
    const lcd = new LCDClient({
        URL: network.lcd,
        chainID: network.chainID,
    })
    return useQuery(
        [""],
        () => lcd.oracle.exchangeRates(),
        {
            refetchInterval: 1000 * 60 * 2,
            enabled: true,
            keepPreviousData: true,
            onError: queryErrorReporter,
        },
    )
}

export const useLunaExchange = (): any | undefined => {
    const {data: exchangeRates} = useExchangeRates()
    if (exchangeRates)
        return exchangeRates.get("uusd").amount;
    return undefined;
}
