import { u, UST } from '@anchor-protocol/types';
import { microfy } from '@libs/formatter';
import { FormReturn } from '@libs/use-form';
import big, { Big, BigSource } from 'big.js';

export interface EarnWithdrawFormInput {
  withdrawAmount: UST;
}

export interface EarnWithdrawFormDependency {
  userUUSTBalance: u<UST<BigSource>>;
  fixedGas: u<UST<BigSource>>;
  totalDeposit: u<UST<BigSource>>;
  isConnected: boolean;
  coin: string,
}

export interface EarnWithdrawFormStates extends EarnWithdrawFormInput {
  receiveAmount?: u<UST<BigSource>>;
  txFee?: u<UST<BigSource>>;
  invalidTxFee?: string;
  invalidWithdrawAmount?: string;
  availablePost: boolean;
  coin?: string;
}

export interface EarnWithdrawFormAsyncStates {}

export const earnWithdrawForm =
  ({
    isConnected,
    totalDeposit,
    userUUSTBalance,
    fixedGas,
    coin,
  }: EarnWithdrawFormDependency) =>
  ({
    withdrawAmount,
  }: EarnWithdrawFormInput): FormReturn<
    EarnWithdrawFormStates,
    EarnWithdrawFormAsyncStates
  > => {
    if (withdrawAmount.length === 0) {
      return [
        {
          withdrawAmount: '' as UST,
          availablePost: false,
        },
        undefined,
      ];
    } else {
      let invalidTxFee = "";
      let invalidWithdrawAmount = "";
      const txFee = big(fixedGas) as u<UST<Big>>;
      const getReceiveAmount = () => {
          if (coin === 'uusd') {
            const receiveAmount = microfy(withdrawAmount).minus(txFee) as u<UST<Big>>;
            return receiveAmount
          }
          if (coin === 'uluna') {
            const receiveAmount = microfy(withdrawAmount).minus(txFee.div(10)) as u<UST<Big>>;
            return receiveAmount
          }

      }

      switch (coin) {
        case "uusd":
          console.log(withdrawAmount, totalDeposit);
          // invalidTxFee
          invalidTxFee = (() => {
            return isConnected && big(userUUSTBalance).lt(txFee)
              ? 'Not enough transaction fees'
              : undefined;
          })();

          // invalidWithdrawAmount
          invalidWithdrawAmount = (() => {
            if (!isConnected) {
              return undefined;
            }

            return microfy(withdrawAmount).gt(totalDeposit)
              ? `Not enough aUST`
              : big(userUUSTBalance).lt(txFee)
              ? `Not enough UST`
              : undefined;
          })();

          return [
            {
              withdrawAmount: withdrawAmount,
              txFee,
              coin,
              receiveAmount: getReceiveAmount(),
              invalidTxFee,
              invalidWithdrawAmount,
              availablePost:
                isConnected &&
                big(withdrawAmount).gt(0) &&
                !invalidTxFee &&
                !invalidWithdrawAmount,
            },
            undefined,
          ];
        case "uluna":
          return [
            {
              withdrawAmount: withdrawAmount,
              txFee,
              coin,
              receiveAmount: getReceiveAmount(),
              invalidTxFee,
              invalidWithdrawAmount,
              availablePost:
                isConnected &&
                big(withdrawAmount).gt(0) &&
                !invalidTxFee &&
                !invalidWithdrawAmount,
            },
            undefined,
          ];
      }
    }
  };
