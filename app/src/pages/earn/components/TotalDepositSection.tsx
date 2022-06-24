import React, {useCallback, useMemo} from 'react';
import {computeTotalDeposit} from '@anchor-protocol/app-fns';
import {useEarnEpochStatesQuery} from '@anchor-protocol/app-provider';
import {
    formatUST,
    formatUSTWithPostfixUnits,
    MILLION,
} from '@anchor-protocol/notation';
import {demicrofy, MICRO} from '@libs/formatter';
import {ActionButton} from '@libs/neumorphism-ui/components/ActionButton';
import {BorderButton} from '@libs/neumorphism-ui/components/BorderButton';
import {IconSpan} from '@libs/neumorphism-ui/components/IconSpan';
import {InfoTooltip} from '@libs/neumorphism-ui/components/InfoTooltip';
import {Typography} from '@material-ui/core'
import {Section} from '@libs/neumorphism-ui/components/Section';
import {AnimateNumber} from '@libs/ui';
import {SubAmount} from 'components/primitives/SubAmount';
import {useAccount} from 'contexts/account';
import {useBalances} from 'contexts/balances';
import {useDepositDialog, useDepositDialogUpdate} from './useDepositDialog';
import {useWithdrawDialog} from './useWithdrawDialog';
import {useRewards} from '../../mypage/logics/useRewards';
import {sum} from '@libs/big-math';
import {u, UST} from '@anchor-protocol/types';
import big from 'big.js';
import Big from 'big.js';
import { useDeposits, useLunaExchange } from '@anchor-protocol/app-provider';
import { MyTool } from '@libs/neumorphism-ui/components/InfoTooltip';
import RefreshIcon from '@material-ui/icons/Refresh';
export interface TotalDepositSectionProps {
    className?: string;
    coin?: string,
    coinName?: string;
}


export function TotalDepositSection({className}: TotalDepositSectionProps) {
    // ---------------------------------------------
    // queries
    // ---------------------------------------------
  const dataa = useDeposits();

  const rate = useLunaExchange();
  const { totalBalance } = useMemo<{
      totalBalance: {amount: big};
  }>(() => {
    return {
      totalBalance: {
        amount: rate
          ? big(dataa.luna.amount)
              .plus(dataa.luna.reward_amount)
              .mul(rate)
              .plus(dataa.ust.amount)
              .plus(dataa.ust.reward_amount)
          : big(0),
      }
    }},[dataa, rate])
  const {xyzLunaAsUST, xyzUST} = useRewards();
    // ---------------------------------------------
    // computes
    // ---------------------------------------------
  const {totalDeposit} = useMemo(() => {
        console.log(xyzLunaAsUST.toString())
        console.log(xyzUST.mul(100).toString())
        const totalValue = sum(
            big(0).plus(xyzLunaAsUST!).plus(xyzUST!),
        ) as u<UST<Big>>;
    
        return {
            // @ts-ignore
            totalDeposit: totalValue,
        };
    }, [xyzLunaAsUST, xyzUST]);
 
    // ---------------------------------------------
    // presentation
    // ---------------------------------------------
    return (
        <Section className={className}>
        <div>
            <Typography style={{fontSize: "20px", fontWeight:860}}>
                TOTAL BALANCE{' '}
                <InfoTooltip className={'info'} style={{verticalAlign: '-webkit-baseline-middle', fontSize:'18px', marginLeft:'3px'}}>
                Total value of your UST/Luna deposits including earnings calculated in UST
                </InfoTooltip>
            </Typography>

            <div className="amount" style={{fontWeight:860, fontSize:'35px'}}>
                <AnimateNumber format={formatUST}>
                    {totalBalance.amount.div(1000000).toFixed(2).toString()}
                </AnimateNumber>{' '}
                <span style={{fontSize:'20px'}}>UST</span>
        </div>
            </div>
                <DepositButtonsTD coin={'uluna'} style={{width:"425px"}}/>

        </Section>
    );
}

export function DepositButtonsTD({className, coin}: TotalDepositSectionProps) {
    // ---------------------------------------------
    // dependencies
    // ---------------------------------------------
    const {connected} = useAccount();

    // ---------------------------------------------
    // queries
    // ---------------------------------------------
    let nativeBalance;
    let stakedBalance;
    switch (coin) {
        case "uluna":
            const {uNative} = useBalances();
            const {luna} = useDeposits();
            nativeBalance = uNative;
            stakedBalance = luna.amount;
            break;
        case "uusd":
            const {uUST} = useBalances();
            const {ust} = useDeposits();
            nativeBalance = uUST;
            stakedBalance = ust.amount;
            break;
    }

    // ---------------------------------------------
    // dialogs
    // ---------------------------------------------
    const [openDepositDialog, depositDialogElement] = useDepositDialog(coin);

    const [openWithdrawDialog, withdrawDialogElement] = useWithdrawDialog(coin);

    const openDeposit = useCallback(async () => {
        await openDepositDialog();
    }, [openDepositDialog]);

    const openWithdraw = useCallback(async () => {
        await openWithdrawDialog();
    }, [openWithdrawDialog]);


    // ---------------------------------------------
    // presentation
    // ---------------------------------------------
    return (<div style={{display: "flex", justifyContent: "end", marginBottom:"5px" }}>   
        <div>
        <ActionButton
            className="sizeButton"
            disabled={!connected || Big(nativeBalance).lte(0)}
            onClick={openDeposit}
            style={{width:'200px', height: '45px', marginRight:'12px'}}
        >
            Deposit
        </ActionButton>
        <BorderButton
            className="sizeButton border"
           // disabled={!connected }
            disabled={!connected || Big(nativeBalance).lte(0)}
            onClick={openWithdraw}
            style={{width:'200px', height: '45px', marginLeft:'12px'}}
        >
            Withdraw
        </BorderButton>
        </div>

        {depositDialogElement}
        {withdrawDialogElement}
    </div>);
} 


export function DepositButtons({className, coin}: TotalDepositSectionProps) {
    // ---------------------------------------------
    // dependencies
    // ---------------------------------------------
    const {connected} = useAccount();

    // ---------------------------------------------
    // queries
    // ---------------------------------------------
    let nativeBalance;
    let stakedBalance;
    switch (coin) {
        case "uluna":
            const {uNative} = useBalances();
            const {luna} = useDeposits();
            nativeBalance = uNative;
            stakedBalance = luna.amount;
            break;
        case "uusd":
            const {uUST} = useBalances();
            const {ust} = useDeposits();
            nativeBalance = uUST;
            stakedBalance = ust.amount;
            break;
    }


    // ---------------------------------------------
    // dialogs
    // ---------------------------------------------
    const [openDepositDialog, depositDialogElement] = useDepositDialog(coin);

    const [openWithdrawDialog, withdrawDialogElement] = useWithdrawDialog(coin);

    const openDeposit = useCallback(async () => {
        await openDepositDialog();
    }, [openDepositDialog]);

    const openWithdraw = useCallback(async () => {
        await openWithdrawDialog();
    }, [openWithdrawDialog]);


    // ---------------------------------------------
    // presentation
    // ---------------------------------------------
    return (<div style={{display: "flex", justifyContent: "center"}}>
        <ActionButton
            className="sizeButton"
            disabled={!connected || Big(nativeBalance).lte(0)}
            onClick={openDeposit}
        >
            Deposit
        </ActionButton>
        <BorderButton
            className="sizeButton border"
            disabled={!connected || Big(stakedBalance).lte(0)}
            onClick={openWithdraw}
        >
            Withdraw
        </BorderButton>

        {depositDialogElement}
        {withdrawDialogElement}
    </div>);
} 



export function UpdateBalanceButton({className, coin, proceed1, deposit,  txFee, invalidNextTxFee}: any) {
    // ---------------------------------------------
    // dependencies
    // ---------------------------------------------
    const {connected} = useAccount();
    const updateStyles = {
      maxWidth:"91px",
      fontSize:'9px',
      height:'19px',
      width: '91px',
      padding:'2px',
      fontWeight:300,
      background: '493C3C',
      color:'#CEBFBF',
    }

    // ---------------------------------------------
    // queries
    // ---------------------------------------------
    let nativeBalance;
    let stakedBalance;
    switch (coin) {
        case "uluna":
            const {uNative} = useBalances();
            const {luna} = useDeposits();
            nativeBalance = uNative;
            stakedBalance = luna.amount;
            break;
        case "uusd":
            const {uUST} = useBalances();
            const {ust} = useDeposits();
            nativeBalance = uUST;
            stakedBalance = ust.amount;
            break;
    }

    // ---------------------------------------------
    // dialogs
    // ---------------------------------------------
    const [openDepositDialogUpdate, depositDialogElement] = useDepositDialogUpdate(coin);


    const openDeposit = useCallback(async () => {
        await openDepositDialogUpdate();
    }, [openDepositDialogUpdate]);


    // ---------------------------------------------
    // presentation
    // ---------------------------------------------
    return (<div style={{display: "flex", justifyContent: "end", marginTop:'10px'}}>
        <ActionButton
            className="sizeButton"
            disabled={!connected || Big(nativeBalance).lte(0)}
            onClick={() => { 
            if (coin === 'uluna') {
            proceed1(deposit,'11500',invalidNextTxFee) 
            }
            if (coin === 'uusd') {
            proceed1(deposit,'150000',invalidNextTxFee) 
            }
        } 
    }
            style={updateStyles}
        >
            <RefreshIcon style={{fontSize:'10px', marginRight: '3px'}}/>
            Update Balance
            
        </ActionButton>

        {depositDialogElement}
    </div>);
} 

export function StakeButton({className, coin, coinName}: TotalDepositSectionProps) {
    // ---------------------------------------------
    // dependencies
    // ---------------------------------------------
    const stakeStyles = {
      maxWidth:"357px",
      width: '90%',
      padding:'21px',
      fontWeight:720,
    }
    const {connected} = useAccount();

    // ---------------------------------------------
    // queries
    // ---------------------------------------------
    let nativeBalance;
    let stakedBalance;
    switch (coin) {
        case "uluna":
            const {uNative} = useBalances();
            const {luna} = useDeposits();
            nativeBalance = uNative;
            stakedBalance = luna.amount;
            break;
        case "uusd":
            const {uUST} = useBalances();
            const {ust} = useDeposits();
            nativeBalance = uUST;
            stakedBalance = ust.amount;
            break;
    }

    // ---------------------------------------------
    // dialogs
    // ---------------------------------------------
    const [openDepositDialog, depositDialogElement] = useDepositDialog(coin);


    const openDeposit = useCallback(async () => {
        await openDepositDialog();
    }, [openDepositDialog]);


    // ---------------------------------------------
    // presentation
    // ---------------------------------------------
    return (<div style={{display: "flex", justifyContent: "center"}}>
        <ActionButton
            className="sizeButton"
            disabled={!connected || Big(nativeBalance).lte(0)}
            onClick={openDeposit}
            style={stakeStyles}
        >
            Deposit {coinName}
        </ActionButton>

        {depositDialogElement}
    </div>);
} 
