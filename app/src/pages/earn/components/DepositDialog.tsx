import {
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { useState } from 'react';
import { UST } from '@anchor-protocol/types';
import { EarnDepositFormReturn } from '@anchor-protocol/app-provider';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import { BorderButton} from '@libs/neumorphism-ui/components/BorderButton';
import type { DialogProps } from '@libs/use-dialog';
import { InputAdornment, Modal } from '@material-ui/core';
import { StreamResult, StreamStatus } from '@rx-stream/react';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import React, { ChangeEvent, useMemo } from 'react';
import styled from 'styled-components';
import { useAccount } from 'contexts/account';
import { AmountSlider } from './AmountSlider';
import { UIElementProps } from '@libs/ui';
import { TxResultRendering } from '@libs/app-fns';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { BroadcastTxStreamResult } from './types';
import { useLunaExchange } from '@anchor-protocol/app-provider';
import big, {Big} from 'big.js';
import {estimateSend, fetchData, sleep} from '../../../Util';

interface DepositDialogParams extends UIElementProps, EarnDepositFormReturn {
  txResult: StreamResult<TxResultRendering> | null;
}

type DepositDialogReturn = void;
type DepositDialogProps = DialogProps<
  DepositDialogParams,
  DepositDialogReturn
> & {
  renderBroadcastTxResult?: JSX.Element;
};

function DepositDialogBase(props: DepositDialogProps) {
  const {
    className,
    children,
    txResult,
    closeDialog,
    depositAmount,
    txFee,
    sendAmount,
    maxAmount,
    invalidTxFee,
    invalidNextTxFee,
    invalidDepositAmount,
    updateDepositAmount,
    renderBroadcastTxResult,
    coin,
    setCoin,
    toggled,
    setToggled
  } = props;
  const account = useAccount();
  const [switchStateUST, setSwitchStateUST] = React.useState(true);
  const [switchStateLUNA, setSwitchStateLUNA] = React.useState(true);
  React.useEffect(()=>{
      if (coin === 'uluna') { setSwitchStateUST(false)}
      if (coin === 'uusd') { setSwitchStateLUNA(false)}
        
  },[]) 

  let formatOutput;
  let formatInput;
  let demicrofy;
  let symbol;
  const lunaUustExchangeRate = useLunaExchange();
  const getLunaFee = () => {
     //@ts-ignore 
     // return lunaUustExchangeRate.mul(big(txFee).div(big(1000000000)).toNumber()).mul(1000000).toFixed();
     return 11500

  }
    const getOutput = () => {
        if (coin === 'uusd'){
            return formatOutput(demicrofy(maxAmount))
        }
        if (coin === 'uluna'){
            return  formatOutput(demicrofy(maxAmount))
        }

    }
    

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
        <div className={'top-bar'} style={{display: "inline-flex", alignItems:"center", justifyContent:'center', margin: '0 auto', width:'100%', marginBottom:"30px"}}>
        <h1>Deposit  </h1>
        <div
              style={{ display:"inline-flex", background:"#493C3C", borderRadius:'12px', marginLeft:'15px'}}
              >
        <SwitchButton onClick={(e: any)=>{
              if (coin === 'uusd') {
                setCoin('uluna');
                setSwitchStateUST(false)
                setSwitchStateLUNA(true)
                return;
              } else {
                setCoin('uusd');
                setSwitchStateUST(true)
                setSwitchStateLUNA(false)
                return;
              }

        }}
        disabled={switchStateUST}
        >
        UST
        </SwitchButton>
        <SwitchButton onClick={(e: any)=>{
              console.log(coin);
              if (coin === 'uusd') {
                setCoin('uluna');
                setSwitchStateUST(false)
                setSwitchStateLUNA(true)
                return;
              } else {
                setCoin('uusd');
                setSwitchStateUST(true)
                setSwitchStateLUNA(false)
                return;
              }

        }}
        disabled={switchStateLUNA}>
        Luna
        </SwitchButton>
        </div>
    </div>
        {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

        <NumberInput
          className="amount"
          value={depositAmount}
          maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="AMOUNT"
          error={!!invalidDepositAmount}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateDepositAmount(target.value)
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">{symbol}</InputAdornment>,
          }}
        />

        <div className="wallet" aria-invalid={!!invalidDepositAmount}>
          <span>{invalidDepositAmount}</span>
          <span>
            MAX:{' '}
            <span
              style={{
                cursor: 'pointer',

              }}
               onClick={() =>
                maxAmount &&
                updateDepositAmount(formatInput(demicrofy(maxAmount)))
              }
            >
              {
              getOutput()
              }
              {` ${symbol}`}
            </span>
          </span>
        </div>

        <figure className="graph">
          <AmountSlider
            disabled={!account.connected}
            max={Number(demicrofy(maxAmount))}
            txFee={Number(demicrofy(txFee ?? ('0' as UST)))}
            value={Number(depositAmount)}
            onChange={(value) => {
              updateDepositAmount(formatInput(value.toString() as UST));
              setAmount(formatInput(value.toString()))
            }}
          />
        </figure>

        {(
          <TxFeeList className="receipt">
            { coin === 'uusd' && (

            
              <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
                {txFee ? formatOutput(demicrofy(txFee)): '0'}
                {` ${symbol}`}
              </TxFeeListItem>
            )}
            {coin === 'uluna'&& (

            
              <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
                {txFee ? formatOutput(demicrofy(getLunaFee(txFee))): '0'}
                {` ${symbol}`}
              </TxFeeListItem>
            )}
            <TxFeeListItem label="Receive Amount">
              {sendAmount ? formatOutput(demicrofy(sendAmount)): '0'}
              {` ${symbol}`}
            </TxFeeListItem>
          </TxFeeList>
        )}
        {children}
      </Dialog>
    </Modal>
  );
}

function DepositDialogBaseUpdate(props: DepositDialogProps) {
  const {
    className,
    children,
    txResult,
    closeDialog,
    depositAmount,
    txFee,
    sendAmount,
    maxAmount,
    invalidTxFee,
    invalidNextTxFee,
    invalidDepositAmount,
    updateDepositAmount,
    renderBroadcastTxResult,
    coin,
  } = props;

  const account = useAccount();

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
       <h1>Update {coin === 'uluna' && <span>Luna</span>}{coin === 'uusd' && <span>UST</span>} Balance for Withdraw</h1>

        {children}
      </Dialog>
    </Modal>
  );
}

const SwitchButton = styled(BorderButton)`
    border-radius:12px;
    height:29px;
    width: 93px;
    

        border: 4px #493C3C;
        background-color: #493C3C;
        color: #CEBFBF;
        opacity: 0.3;
    &:disabled {
    background-color: #CEBFBF;
    opacity: 1;
    color: #493C3C;
    }
`;

export const DepositDialog = styled(DepositDialogBase)`
  width: 600px;
  height: 470px;
  touch-action: none;
  .top-bar {
  }
  .dialog-content {
     margin: 40px !important;

  }

  h1 {
    font-size: 20px;
    text-align: center;
    font-weight: 860;

  }

  .amount {
    width: 100%;
    margin-bottom: 5px;

    .MuiTypography-colorTextSecondary {
      color: currentColor;
    }
  }
    .button-wrap {
     margin: auto;
     margin-top: 25px;
     width: fit-content;

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
    margin-top: 70px;
  }

  .receipt {
    margin-top: 30px;
  }

  .button {
    margin: auto;

    width: 466px;
    height: 45px;
    border-radius: 30px;
  }
`;
export const DepositDialogUpdate = styled(DepositDialogBaseUpdate)`
  width: 720px;
  touch-action: none;

  h1 {
    font-size: 20px;
    text-align: center;
    font-weight: 860;

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

    font-size: 12px;
    color: ${({ theme }) => theme.dimTextColor};

    &[aria-invalid='true'] {
      color: ${({ theme }) => theme.colors.negative};
    }
  }

  .graph {
    margin-top: 80px;
    margin-bottom: 40px;
  }

  .receipt {
    margin-top: 30px;
  }


  .button {
    margin-top: 45px;

    width: 100%;
    height: 60px;
    border-radius: 30px;
  }
`;
