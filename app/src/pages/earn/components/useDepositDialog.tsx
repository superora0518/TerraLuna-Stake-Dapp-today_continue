import React, { ReactNode } from 'react';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import { FormParams, FormReturn } from './types';
import { TerraDepositDialog, TerraDepositDialogUpdate } from './terra';
import { EvmDepositDialog } from './evm';
import { DeploymentSwitch } from 'components/layouts/DeploymentSwitch';

function Component({ closeDialog, coin }: DialogProps<FormParams, FormReturn>) {
  return (
    <DeploymentSwitch
      terra={<TerraDepositDialog coin={coin} closeDialog={closeDialog} />}
      ethereum={<EvmDepositDialog closeDialog={closeDialog} />}
    />
  );
}
function Component2({ closeDialog, coin }: DialogProps<FormParams, FormReturn>) {
  return (
    <DeploymentSwitch
      terra={<TerraDepositDialogUpdate coin={coin} closeDialog={closeDialog} />}
      ethereum={<EvmDepositDialog closeDialog={closeDialog} />}
    />
  );
}

export function useDepositDialog(coin: string): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog<FormParams, FormReturn>(Component, coin);
}
export function useDepositDialogUpdate(coin: string): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog<FormParams, FormReturn>(Component2, coin);
}
