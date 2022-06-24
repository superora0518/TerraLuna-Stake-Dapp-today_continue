import {
  earnWithdrawForm,
  EarnWithdrawFormStates,
} from '@anchor-protocol/app-fns';
import { UST, u } from '@anchor-protocol/types';
import { useFixedFee } from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import { useAccount } from 'contexts/account';
import { useBalances } from 'contexts/balances';
import { useCallback, useMemo } from 'react';
import big, { Big } from 'big.js';

export interface EarnWithdrawFormReturn extends EarnWithdrawFormStates {
  updateWithdrawAmount: (withdrawAmount: UST) => void;
}

export function useEarnWithdrawForm({coin}): EarnWithdrawFormReturn {
  const { connected } = useAccount();

  const fixedFee = useFixedFee();

    let balance;
    switch (coin) {
        case "uluna":
            const {uxyzLuna} = useBalances();
            console.log("im u luna", uxyzLuna.toString());
            balance = uxyzLuna;
            break;
        case "uusd":
            const {uxyzUST} = useBalances();
            console.log("im u ust", uxyzUST.toString());
            balance = uxyzUST;
            break;
    }

  const { totalDeposit } = useMemo(() => {
    return {
      totalDeposit: big(balance)
      ,
    };
  }, [balance]);

  const [input, states] = useForm(
    earnWithdrawForm,
    {
      isConnected: connected,
      fixedGas: fixedFee,
      userUUSTBalance: balance,
      totalDeposit: totalDeposit as u<UST<Big>>,
      coin: coin,
    },
    () => ({ withdrawAmount: '' as UST }),
  );

  const updateWithdrawAmount = useCallback(
    (withdrawAmount: UST) => {
      input({
        withdrawAmount,
      });
    },
    [input],
  );

  return {
    ...states,
    updateWithdrawAmount,
  };
}
