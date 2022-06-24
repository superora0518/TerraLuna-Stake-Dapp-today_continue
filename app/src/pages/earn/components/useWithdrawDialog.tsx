import type { ReactNode } from 'react';
import React from 'react';
import type { DialogProps, OpenDialog } from '@libs/use-dialog';
import { useDialog } from '@libs/use-dialog';
import { FormParams, FormReturn } from './types';
import { TerraWithdrawDialog, TerraWithdrawDialog2 } from './terra';
import { EvmWithdrawDialog } from './evm';
import { DeploymentSwitch } from 'components/layouts/DeploymentSwitch';

function Component(props: DialogProps<FormParams, FormReturn>) {
  return (
    <DeploymentSwitch
      terra={<TerraWithdrawDialog {...props} />}
      ethereum={<EvmWithdrawDialog {...props} />}
    />
  );
}

export function useWithdrawDialog(coin: string): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog<FormParams, FormReturn>(Component, coin);
}

function Component2(props: DialogProps<FormParams, FormReturn>) {
  return (
    <DeploymentSwitch
                //@ts-ignore
      terra={<TerraWithdrawDialog2 {...props} />}
      ethereum={<EvmWithdrawDialog {...props} />}
    />
  );
}

export function useWarningDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog<FormParams, FormReturn>(Component2);
}
