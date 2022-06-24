import { useDeposits, EarnWithdrawFormReturn } from '@anchor-protocol/app-provider';
import {
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { UST, u, aUST } from '@anchor-protocol/types';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import type { DialogProps } from '@libs/use-dialog';
import { InputAdornment, Modal } from '@material-ui/core';
import { StreamResult, StreamStatus } from '@rx-stream/react';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { useAccount } from 'contexts/account';
import React, { ChangeEvent, useMemo } from 'react';
import styled from 'styled-components';
import { useBalances } from 'contexts/balances';
import { AmountSlider } from './AmountSlider';
import { TxResultRendering } from '@libs/app-fns';
import { UIElementProps } from '@libs/ui';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { BroadcastTxStreamResult } from './types';
import big, {Big} from 'big.js';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { UpdateBalanceButton } from '../../earn/components/TotalDepositSection';
import {useLunaExchange} from '@anchor-protocol/app-provider'
import { useEarnDepositTx } from '@anchor-protocol/app-provider/tx/earn/deposit';
import { useEarnDepositForm } from '@anchor-protocol/app-provider';
import { useConfirm } from '@libs/neumorphism-ui/components/useConfirm';
interface WithdrawDialogParams extends UIElementProps, EarnWithdrawFormReturn {
  txResult: StreamResult<TxResultRendering> | null;
}

type WithdrawDialogReturn = void;

type WithdrawDialogProps = DialogProps<
  WithdrawDialogParams,
  WithdrawDialogReturn
> & {
  renderBroadcastTxResult?: JSX.Element;
};

function WithdrawDialogBase(props: WithdrawDialogProps) {
  const {
    className,
    children,
    txResult,
    closeDialog,
    withdrawAmount,
    receiveAmount,
    txFee,
    invalidTxFee,
    invalidWithdrawAmount,
    updateWithdrawAmount,
    renderBroadcastTxResult,
    coin,
    setContinued,
    
  } = props;

  const { connected } = useAccount();
  const { uxyzUST, uxyzLuna } = useBalances();
  const amts = useDeposits()
  console.log(amts)
  const lunaUustExchangeRate = useLunaExchange();
      console.log(txFee)
  const getLunaFee = () => {
     //@ts-ignore 
     // return lunaUustExchangeRate.mul(big(txFee).div(big(1000000000)).toNumber()).mul(1000000).toFixed();
     return 11500

  }
  const state = useEarnDepositForm({coin: coin, qualified: false});

  const [deposit, depositTxResult] = useEarnDepositTx({qualified: false});
  const [openConfirm, confirmElement] = useConfirm();

  const { depositAmount, invalidNextTxFee, availablePost, } = state;
 const getFee = () => {
    if (coin === 'uluna') {
            return  '11500'
            }
            if (coin === 'uusd') {
            return '150000'
            }
        }

  const proceed1 = React.useCallback(
    async (
      depositAmount: UST,
      txFeee: any,
      confirm: any,
    ) => {

      if (!connected || !deposit) {
        return;
      }

      if (confirm) {
        const userConfirm = await openConfirm({
          description: confirm,
          agree: 'Proceed',
          disagree: 'Cancel',
        });

        if (!userConfirm) {
          return;
        }
      }

      deposit({
        depositAmount: '0.00001',
        depositDenom: coin,
        txFee: getFee(),
      });
    },
    [connected,  deposit, openConfirm, coin],
  );

  let formatOutput;
  let formatInput;
  let demicrofy;
  let symbol;

  switch (coin) {
    case "uluna":
      ({
        native: { formatOutput, formatInput, demicrofy, symbol },
      } = useFormatters());
      break;
    case "uusd":
      ({
        ust: { formatOutput, formatInput, demicrofy, symbol },
      } = useFormatters());
      break;
  }

    const getOutput = () => {
        if (coin === 'uusd'){
            return formatOutput(demicrofy(totalDeposit.div(100)))
        }
        if (coin === 'uluna'){
            return  formatOutput(demicrofy(totalDeposit.div(100)))
        }

    }
  
  const { totalDeposit, balance } = useMemo(() => {
    let theAmt = "0"
        if (coin === 'uusd'){
          theAmt = amts.ust.amount
        }
        if (coin === 'uluna'){
          theAmt = amts.luna.amount
        }
    return {
      totalDeposit: theAmt ? big(theAmt).mul(100) as u<aUST<Big>> : big(0),
      balance: theAmt
    };
  }, [amts]);

  const renderBroadcastTx = useMemo(() => {
    if (renderBroadcastTxResult) {
      return renderBroadcastTxResult;
    }

    return (
      <TxResultRenderer
        resultRendering={(txResult as BroadcastTxStreamResult).value}
        onExit={closeDialog}
      />
    );
  }, [renderBroadcastTxResult, closeDialog, txResult]);

  if (
    txResult?.status === StreamStatus.IN_PROGRESS ||
    txResult?.status === StreamStatus.DONE
  ) {
    return (
      <Modal open disableBackdropClick disableEnforceFocus>
        <Dialog className={className}>{renderBroadcastTx}</Dialog>
      </Modal>
    );
  }

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        {children}

        {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

        <NumberInput
          className="amount"
          value={withdrawAmount}
          maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="AMOUNT"
          error={!!invalidWithdrawAmount}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateWithdrawAmount(target.value)
          }
          
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">{symbol}</InputAdornment>
            ),
          }}
        />

        <div className="wallet" aria-invalid={!!invalidWithdrawAmount}>
          <span>{invalidWithdrawAmount}</span>
          <span>
            MAX:{' '}
            <span
              style={{
                cursor: 'pointer',

              }}
              onClick={() =>
                totalDeposit.gt(0) &&
                updateWithdrawAmount(formatInput(demicrofy(totalDeposit.div(100))))
              }
            >
              {
              getOutput()}
              {` ${symbol}`}
            </span>
          </span>
        </div>
        <UpdateBalanceButton coin={coin} proceed1={proceed1} txFee={txFee} deposit={deposit} className={'update'}/>

        <figure className="graph">
          <AmountSlider
            disabled={!connected}
            max={Number(demicrofy(totalDeposit.div(100)))}
            txFee={Number(demicrofy(txFee ?? ('0' as UST)))}
            value={Number(withdrawAmount)}
            onChange={(value) => {
              updateWithdrawAmount(formatInput(value.toString()));
            }}
          />
        </figure>
        {(
          <TxFeeList className="receipt">
            {coin === 'uusd' && (

            
              <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
                {txFee ? formatOutput(demicrofy(txFee)): '0'}
                {` ${symbol}`}
              </TxFeeListItem>
            )}
            {coin === 'uluna'&& (

            
              <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
                {txFee ? formatOutput(demicrofy(getLunaFee())): '0'}
                {` ${symbol}`}
              </TxFeeListItem>
            )}
            <TxFeeListItem label="Receive Amount">
              {receiveAmount ? formatOutput(demicrofy(receiveAmount)): '0'}
              {` ${symbol}`}
            </TxFeeListItem>
          </TxFeeList>
        )}

        <ActionButton
          className="button"
          disabled={!connected }
          //onClick={() => proceed(withdrawAmount, txFee)}
          style={{fontWeight:800, fontSize:"13px"}}
          onClick={() => {
          //@ts-ignore
           props.setContinued(true);
           

          }}
        >
          Proceed
        </ActionButton>


      </Dialog>
    </Modal>
  );
}

export const WithdrawDialog = styled(WithdrawDialogBase)`
  width: 562px;
  height: 472px;
  .warning-box {

  width: 562px;
  height: 472px;
  }
  .update {
  height:19px;
  width:91px;
    
  }
  h1 {
    font-size: 27px;
    text-align: center;
    font-weight: 300;

    margin-bottom: 50px;
  }

  .amount {
    width: 100%;
    margin-bottom: 5px;

    .MuiTypography-colorTextSecondary {
      color: currentColor;
    }
  }

  .wallet {
    display: flex;
    justify-content: space-between;

    font-size: 9px;
    color: #CEC0C0;
    letter-spacing: -0.03em !important; 
    margin-top:4px;
    font-weight:400;

    &[aria-invalid='true'] {
      color: ${({ theme }) => theme.colors.negative};
    }
  }

  .graph {
    margin-top: 55px;
    margin-bottom: 20px;
  }

  .receipt {
    margin-top: 30px;
    font-size:9px;
    font-weight:400;
    color:#CEC0C0;
    letter-spacing: -0.03em !important; 
    
  }

  .button {

    width: 466px;
    height: 45px;
    margin-top: 20px;
    border-radius: 30px;
  }
`;
