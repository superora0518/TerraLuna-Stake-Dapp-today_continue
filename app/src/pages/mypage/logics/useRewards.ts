import React from 'react'
import {
    useXyzDepositorQuery,
    useLunaExchange,
} from '@anchor-protocol/app-provider';
import {useAccount} from 'contexts/account';
import big from 'big.js';
import { useAnchorBank } from '@anchor-protocol/app-provider';


export function useRewards() {
    const {terraWalletAddress} = useAccount();
    const data = useXyzDepositorQuery(terraWalletAddress);
    const [newData, setNewData] = React.useState<any>()
    let totalPayedInterest = big(0);
    let totalDaysStaked = 0;
        let lunaUustExchangeRate = big(0);
    lunaUustExchangeRate = useLunaExchange();

    let xyzLuna = big(0);
    let xyzLunaAsUST = big(0);
    let xyzLunaAsUSTDeposit = big(0);
    let sumXyzLuna = big(0);

    let xyzUST = big(0);
    let sumXyzUST = big(0);
    let answer2 = 0;
   /* 
    const {farmInfo} = useAnchorBank();
    //@ts-ignore
    if (farmInfo.userInfoUst !== undefined) {
        //@ts-ignore
        setNewData(farmInfo.userInfoUst)
     }
    
   /* 
    const depositTime_max = Math.max(state.userInfoUst.deposit_time, state.userInfoLuna.deposit_time);                       const depositTime_min = Math.min(state.userInfoUst.deposit_time, state.userInfoLuna.deposit_time); 
        const depositTime = depositTime_min === 0 ? depositTime_max : depositTime_min 
        const period = depositTime > 0 ? Date.now() - depositTime * 1000 : 0;       
        const day = Math.floor((period > 0 ? period : 0) / 1000 / 60 / 60 / 24);   
        */

    let deposit_times = []
    if (data) {
        data.map(
            ( {depositor, denom, i}) => {
                if (depositor.initial_interaction !== 0) {
                deposit_times.push(depositor.initial_interaction)
                }
            if (denom === 'uluna') {
                answer2 += big(depositor.accrued_interest).mul(lunaUustExchangeRate.div(10)).toNumber()
            }
                answer2 += big(depositor.accrued_interest).div(10).toNumber()
            
            })
            

        const timeD = Math.min(...deposit_times)
        console.log(timeD)
        console.log(deposit_times)

        //totalPayedInterest = totalPayedInterestbegin.mul(100)
        totalPayedInterest = big(answer2).mul(10)
        console.log(data.map(({depositor}) => depositor.accrued_interest))
        console.log(answer2)
        totalDaysStaked = Math.floor(
            Math.abs(
                new Date().getTime()
                - new Date(
                    timeD * 1000
                ).getTime()
            ) / (1000 * 60 * 10)
        );

        for (const {depositor, denom} of data) {
            switch (denom) {
                case "uluna":
                    xyzLuna = big(depositor.last_balance).plus(big(depositor.accrued_interest));
                    sumXyzLuna = big(depositor.sum_deposits);
                    if (lunaUustExchangeRate)
                        xyzLunaAsUST = lunaUustExchangeRate.mul(xyzLuna.div(big(1000000)).toNumber()).mul(1000000).toFixed();
                        xyzLunaAsUSTDeposit = lunaUustExchangeRate.mul(sumXyzLuna.div(big(1000000)).toNumber()).mul(1000000).toFixed();
                    break;
                case "uusd":
                    xyzUST = big(depositor.last_balance).plus(big(depositor.accrued_interest));
                    sumXyzUST = big(depositor.sum_deposits);
                    break;
            }
        }
    }

    return {
        totalPayedInterest,
        totalDaysStaked,
        xyzLuna,
        xyzLunaAsUST,
        xyzLunaAsUSTDeposit,
        xyzUST,
        sumXyzLuna,
        sumXyzUST,
    };
}
