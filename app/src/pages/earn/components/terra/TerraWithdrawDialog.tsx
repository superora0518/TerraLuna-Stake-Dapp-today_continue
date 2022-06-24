import React, { useCallback, useState } from 'react';
import {
  useEarnEpochStatesQuery,
  useEarnWithdrawForm,
} from '@anchor-protocol/app-provider';
import { ActionButton} from '@libs/neumorphism-ui/components/ActionButton';
import { BorderButton} from '@libs/neumorphism-ui/components/BorderButton';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { useAccount } from 'contexts/account';
import { WithdrawDialog } from '../WithdrawDialog';
import { useEarnWithdrawTx } from '@anchor-protocol/app-provider/tx/earn/withdraw';
import { aUST, u, UST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { DialogProps } from '@libs/use-dialog';
import { useWarningDialog } from '../useWithdrawDialog';
import { Modal, Switch } from '@material-ui/core';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { withStyles, createStyles, Theme } from '@material-ui/core';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { FormControlLabel, Checkbox, CheckboxProps} from '@material-ui/core';
import { DepositButtons } from '../TotalDepositSection';
import {useLunaExchange} from '@anchor-protocol/app-provider'
import styled from 'styled-components';
import WarningIcon from '@material-ui/icons/Warning';
import { useBalances } from 'contexts/balances';
import {HorizontalDashedRuler} from '@libs/neumorphism-ui/components/HorizontalDashedRuler'

export function TerraWithdrawDialog2(props: any) {

  const [open, setOpen] = React.useState(true);
  const [active, setActive] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      disableBackdropClick
      disableEnforceFocus
    >
      <Dialog className={'woo'} onClose={handleClose} style={{height: '413px', width:'562px'}}>
      <div>
        <h1 style={{
            margin: '0 auto',
            textAlign:'center',
            fontSize:'20px',
            marginBottom:'50px',
            }}>
        WITHDRAW WARNING <WarningIcon style={{verticalAlign: 'bottom'}}/>
        </h1>
      </div>
        <WarnSection className={'warning-content'}>
        <span style={{fontSize:'13px', fontWeight:860, color:'#CEBFBF'}}className={'description'}>
        Are you really sure you want to withdraw?<br/> 
        You may lose your valuable share of the Community Farming Event and your eligibility for the Rewards+ Program. 
        </span>
        <div style={{fontSize:'13px', fontWeight:860, color:'#F9D85E', marginTop: '5px'}}className={'description'}>
        Learn more about your benefits
        </div>
        </WarnSection>
        <div style={{marginTop:'40px', marginBottom:'40px'}}>
        <HorizontalDashedRuler />
        </div>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', marginTop:'20px', marginLeft:'10px'}}>
        <span style={{display: 'inline-flex'}}>
        <FormControlLabel
          control={
            <GreenCheckbox
              name="checkedC"
              onChange={() => {
                if (active) {
                  setActive(false);
                }
                if (!active) {
                  setActive(true);
                }
              }}
            />
          }

        />
        <p style={{fontSize:'9px', width:'110px', height:'33px', alignSelf:'center'}} >Please check the box if you understand that you are losing your benefits</p>
        </span>
        <ActionButton
          disabled={active}
          //onClick={() => proceed(withdrawAmount, txFee)}
          onClick={() => {
            console.log(props.coin, '')
            props.proceed(props.withdrawAmount, props.txFee, props.coin);
            setOpen(false);
          }}
          style={{width:'283px', height:'45px', fontWeight:'860'}}
        >
          YES, I WANT TO LOSE MY BENEFITS!
        </ActionButton>
        </div>
      </Dialog>
    </Modal>
  );
}

export function TerraWithdrawDialog(props: DialogProps<{}, void>) {
  const { connected } = useAccount();
  const [coin, setCoin] = useState(props.coin);
  const [continued, setContinued] = React.useState(false);
  const [switchStateUST, setSwitchStateUST] = React.useState(true);
  const [switchStateLUNA, setSwitchStateLUNA] = React.useState(true);
  const state = useEarnWithdrawForm({ coin: coin });

  const { uxyzUST, uxyzLuna } = useBalances();
  const [withdraw, withdrawTxResult] = useEarnWithdrawTx();

  const { withdrawAmount, txFee, availablePost } = state;

  const [openWithdrawDialog1, withdrawDialogElement] = useWarningDialog();

  const [toggled, setToggled] = React.useState(false);
   const [alignment, setAlignment] = React.useState('left');

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const lunaUustExchangeRate = useLunaExchange();
      console.log(txFee)
  const getLunaFee = (txFee: any) => {
    //  return lunaUustExchangeRate.mul(big(txFee.toString()).div(Big(1000000000)).toNumber()).mul(1000000).toFixed();
        return 11500
        

  }
  React.useEffect(()=>{
      if (coin === 'uluna') { setSwitchStateUST(false)}
      if (coin === 'uusd') { setSwitchStateLUNA(false)}
        
  },[]) 


  const proceed = useCallback(
    async (withdrawAmount: UST, txFee: u<UST<BigSource>> | undefined, coin: string) => {
         const fee =  await getLunaFee(txFee!).toString()
      if (!connected || !withdraw) {
        return;
      }
      if (coin === 'uluna') {
         if (fee !== undefined) {
          withdraw({
            withdrawAmount: Big(withdrawAmount).toString() as UST,
            withdrawDenom: coin,
            txFee: fee as u<UST>,
          });
          }

      } 

      if (coin === 'uusd') {
      withdraw({
        withdrawAmount: Big(withdrawAmount).toString() as UST,
        withdrawDenom: coin,
        txFee: txFee!.toString() as u<UST>,
      });
      }
    },
    [connected, withdraw, coin, getLunaFee],
  );

  const openWithdraw = useCallback(async () => {
    await openWithdrawDialog1();
  }, [openWithdrawDialog1]);

  return (
    <>
      <WithdrawDialog
        {...props}
        {...state}
        setCoin={setCoin}
        txResult={withdrawTxResult}
        coin={coin}
        setContinued={setContinued}
      >
        <div style={{display: "inline-flex", alignItems:"center", justifyContent:'center', margin: '0 auto', width:'100%', marginBottom:"30px"}}>
        <h1 style={{fontWeight:860, fontSize:'20px', marginBottom:'0px', marginRight:"20px"}}>Withdraw </h1>
        <div style={{display:"inline-flex", background:"#493C3C", borderRadius:'12px', marginLeft:'15px'}}>
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
                if (Number(uxyzLuna) > 0) {
                setCoin('uluna');
                setSwitchStateUST(false)
                setSwitchStateLUNA(true)
                }
                return;
              } else {
                if (Number(uxyzUST) > 0) {
                setCoin('uusd');
                setSwitchStateUST(true)
                setSwitchStateLUNA(false)
                }
                return;
              }

        }}
        disabled={switchStateLUNA}>
        Luna
        </SwitchButton>
        </div>
    </div>
      </WithdrawDialog>
      {continued && (
        <TerraWarning
          proceed={proceed}
          withdrawAmount={withdrawAmount}
          txFee={txFee}
          className={'warning-box'}
          coin={coin}
        />
      )}
    </>
  );
}

const WarnSection = styled(Section)`
    background:#493C3C;
    box-shadow: none;
    border: 0.5px solid #000000;
    .NeuSection-root {
        height:131px;
        width:437px;
    }
    .NeuSection-content {
        height:131px;
        width:437px;
        padding: 20px 20px 20px 20px !important;

    }
`;
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
const TerraWarning = styled(TerraWithdrawDialog2)`
    .MuiCheckbox-root {
        background:green;
        color:green;
    }
.woo {
    
    
   .MuiTypography-body1 {
        font-size:9px;
   }
    .warning-content {
      max-width: 437px;
      max-height: 131px;
    }
  }

}
`;
const GreenCheckbox = withStyles({
  root: {
    color:'none',
    '&$checked': {
      color: 'green',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);
