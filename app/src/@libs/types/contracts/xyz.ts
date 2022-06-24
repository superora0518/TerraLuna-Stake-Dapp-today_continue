import {HumanAddr, Token, u} from '@libs/types';

export namespace xyz {
    export interface State {
        state: {};
    }

    export interface StateResponse<T extends Token> {
        tvl: u<T>;
        tvl_indices: number;
        accrued_interest_payments: u<T>;
    }

    export interface TvlHistory {
        tvl: {
            indice: number;
        };
    }

    export interface TvlHistoryResponse<T extends Token> {
        tvl: u<T>;
        epoch: number;
    }

    export interface Depositor {
        ident: {
            address: HumanAddr;
            epoch: number;
        };
    }
    export interface DepositorResponse<T extends Token> {
        accrued_interest: u<T>;
        last_balance: u<T>;
        last_interaction: number;
        initial_interaction: number;
        sum_deposits: number;
    }

}
