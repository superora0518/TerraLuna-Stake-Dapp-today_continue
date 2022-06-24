import React, { useMemo } from 'react';
import { UIElementProps } from '@libs/ui';
import { BalancesContext } from 'contexts/balances';
import { useAnchorWebapp } from '@anchor-protocol/app-provider';
import { ANC, aUST, Native, u } from '@anchor-protocol/types';
import { useCW20Balance, useTerraNativeBalances } from '@libs/app-provider';
import { useAccount } from 'contexts/account';

const TerraBalancesProvider = ({ children }: UIElementProps) => {
  const { contractAddress } = useAnchorWebapp();

  const { terraWalletAddress } = useAccount();

  const { uUST, uLuna } = useTerraNativeBalances(terraWalletAddress);

  const uxyzUST = useCW20Balance<aUST>(
    contractAddress.cw20.xyzUst,
    terraWalletAddress,
  );

  const uxyzLuna = useCW20Balance<aUST>(
    contractAddress.cw20.xyzLuna,
    terraWalletAddress,
  );


  const balances = useMemo(() => {
    return {
      uUST,
      uxyzLuna,
      uxyzUST,
      uNative: uLuna.toString() as u<Native>,
    };
  }, [uUST, uLuna, uxyzLuna,
      uxyzUST]);

  return (
    <BalancesContext.Provider value={balances}>
      {children}
    </BalancesContext.Provider>
  );
};

export { TerraBalancesProvider };
