import {useState, useEffect} from 'react'
import { earnDepositTx, earnDepositTxLuna } from '@anchor-protocol/app-fns';
import { u, UST, HumanAddr } from '@anchor-protocol/types';
import { useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface EarnDepositTxParams {
  // depositAmount can be one of <UST, Luna>
  depositAmount: UST;
  depositDenom: string;
  txFee: u<UST>;
  onTxSucceed?: () => void;
  qualified: boolean
}

export function useEarnDepositTx({qualified}) {
  const connectedWallet = useConnectedWallet();

  const { constants, txErrorReporter, queryClient, contractAddress } =
    useAnchorWebapp();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ depositAmount, depositDenom, txFee, onTxSucceed }: EarnDepositTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

      let marketAddr: HumanAddr;
      switch (depositDenom) {
          case "uluna":
              console.log("im luna");
              marketAddr = contractAddress.moneyMarket.marketLuna;
      return earnDepositTxLuna({
        // fabricateMarketDepositStableCoin
        walletAddr: connectedWallet.walletAddress,
        marketAddr,
        // @ts-ignore
        depositAmount,
        coin: depositDenom,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        txFee,
        gasFee: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        // query
        queryClient,
        // error
        txErrorReporter,
        // side effect
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(ANCHOR_TX_KEY.EARN_DEPOSIT);
        },
        qualified
      });
          case "uusd":
              console.log("im u ust");
              marketAddr = contractAddress.moneyMarket.market;
      return earnDepositTx({
        // fabricateMarketDepositStableCoin
        walletAddr: connectedWallet.walletAddress,
        marketAddr,
        // @ts-ignore
        depositAmount,
        coin: depositDenom,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        txFee,
        gasFee: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        // query
        queryClient,
        // error
        txErrorReporter,
        // side effect
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(ANCHOR_TX_KEY.EARN_DEPOSIT);
        },
        qualified
      });
      }

    },
    [
      connectedWallet,
      contractAddress.moneyMarket.market,
      constants.gasWanted,
      constants.gasAdjustment,
      queryClient,
      txErrorReporter,
      refetchQueries,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
