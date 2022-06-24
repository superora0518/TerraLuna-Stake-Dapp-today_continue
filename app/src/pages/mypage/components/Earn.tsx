import { formatUST, formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { TokenIcon } from '@anchor-protocol/token-icons';
import {
  computeCurrentAPY,
  computeTotalDeposit,
} from '@anchor-protocol/app-fns';
import {
  useAnchorWebapp,
  useEarnEpochStatesQuery,
} from '@anchor-protocol/app-provider';
import { demicrofy, formatRate } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { HorizontalScrollTable } from '@libs/neumorphism-ui/components/HorizontalScrollTable';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { Circles } from 'components/primitives/Circles';
import { fixHMR } from 'fix-hmr';
import { useAccount } from 'contexts/account';
import { useDepositDialog } from 'pages/earn/components/useDepositDialog';
import { useWithdrawDialog } from 'pages/earn/components/useWithdrawDialog';
import { EmptySection } from 'pages/mypage/components/EmptySection';
import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useBalances } from 'contexts/balances';
import { DepositButtons } from '../../earn/components/TotalDepositSection';
import big, {Big} from 'big.js';
import {useRewards} from 'pages/mypage/logics/useRewards';
import { numberWithCommas } from 'pages/dashboard';
import { MyTool } from '@libs/neumorphism-ui/components/InfoTooltip';
import {useDeposits, useLunaExchange} from '@anchor-protocol/app-provider'

export interface EarnProps {
  className?: string;
  depositAmount: Big;
}

function EarnBase(props: any) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { connected } = useAccount();
  const {xyzLunaAsUST, xyzUST, xyzLuna} = useRewards();
  const rate = useLunaExchange()
  const {ust, luna} = useDeposits()
  const { totalDepositLunaUST, totalDepositLuna } = useMemo(() => {
      const rated = rate ? rate : 1
    return {
      // @ts-ignore
      totalDepositLunaUST: computeTotalDeposit(big(luna?.amount).plus(luna?.reward_amount).mul(rated).toFixed() , {}),
      // @ts-ignore
      totalDepositLuna: computeTotalDeposit(big(luna?.amount).plus(luna?.reward_amount).toFixed() , {}).div(100),
    };
  }, [xyzLuna, xyzLunaAsUST, luna, rate]);


  return (
    <>
        {props.tab === "UST" && 
            <StyledEarnUST depositAmount={xyzUST}/>
        }
        {props.tab === "LUNA" && 
            <StyledEarnLuna depositAmount={totalDepositLunaUST} depositAmountLuna={totalDepositLuna}/>
        }
        {props.tab === "all" && <>
        <div style={{marginBottom:"40px"}}>
            <StyledEarnUST depositAmount={big(ust.amount).plus(ust.reward_amount)}/>
        </div>
            <StyledEarnLuna depositAmount={totalDepositLunaUST} depositAmountLuna={totalDepositLuna}/>
       </> }
    </>
  );
}
function EarnUSTBase({ className, depositAmount }: EarnProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { connected } = useAccount();


  // ---------------------------------------------
  // queries
  // ---------------------------------------------


  // ---------------------------------------------
  // computes
  // ---------------------------------------------
  const { totalDeposit } = useMemo(() => {
    return {
      //@ts-ignore
      totalDeposit: computeTotalDeposit(depositAmount, {}),
    };
  }, [depositAmount]);

  // ---------------------------------------------
  // dialogs
  // ---------------------------------------------
  const [openDepositDialog, depositDialogElement] = useDepositDialog('uusd');

  const [openWithdrawDialog, withdrawDialogElement] = useWithdrawDialog('uusd');

  const openDeposit = useCallback(async () => {
    await openDepositDialog();
  }, [openDepositDialog]);

  const openWithdraw = useCallback(async () => {
    await openWithdrawDialog();
  }, [openWithdrawDialog]);

  return (
    <>
      <Section className={className}>
        <HorizontalScrollTable minWidth={600} startPadding={20}>
          <colgroup>
            <col style={{ minWidth: 150, maxWidth: 200 }} />
            <col style={{ minWidth: 100, maxWidth: 200 }} />
            <col style={{ minWidth: 150, maxWidth: 200 }} />
            <col style={{ minWidth: 300, maxWidth: 300 }} />
          </colgroup>
          <thead>
            <tr>
              <th></th>
              <th className={'right'}>
              <MyTool title="Current annualized deposit rate">
              APY
              </MyTool>
              </th>
              <th className={'right'}>
              <MyTool title="Total of all Luna deposits including earnings">
              Total Balance
              </MyTool>
              </th>
              <th style={{textAlign:'center'}}><span style={{paddingLeft:"100px"}}>Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div>
                  <TokenIcon
                    token="ust"
                    style={{ height: '4.3em', width: '4.3em' }}
                  />
                  <div style={{ marginLeft: '20px' }}>
                    <div className="coin">UST</div>
                    <p className="name">Terra USD</p>
                  </div>
                </div>
              </td>
              <td className={'right'}>34.87%</td>
              <td className={'right'}>
              {//@ts-ignore
              formatUSTWithPostfixUnits(depositAmount.div(1000000).toFixed(2))}
              <span> UST</span>
              </td>
              <td style={{ width: '450px', paddingLeft:"200px", paddingRight:"100px"}}>
                <DepositButtons coin={'uusd'}/>
              </td>
            </tr>
          </tbody>
        </HorizontalScrollTable>

        {depositDialogElement}
        {withdrawDialogElement}
      </Section>
        
    {/*  <Section className={className}>
        <div style={{ width: 'fit-content', margin: 'auto' }}>
          <TokenIcon
            token="ust"
            style={{ height: '4.3em', width: '4.3em', margin: 'auto' }}
          />
          <div style={{ textAlign: 'center' }}>
            <div className="coin-mobile">UST</div>
            <p className="name-mobile">Terra USD</p>
          </div>
        </div>
        <section className="mobile-wrap">
          <div className="mobile-box">
            <h2>APY</h2>
            <p>{formatRate(apy)}%</p>
          </div>
          <div className="mobile-box">
            <h2>Deposit Amount</h2>
            <p>{formatUSTWithPostfixUnits(demicrofy(totalDeposit))} UST</p>
          </div>
        </section>
        <div style={{ width: '300px', margin: 'auto' }}>
          <DepositButtons coin={'uusd'} />
        </div>
        {depositDialogElement}
        {withdrawDialogElement}
      </Section> */}
    </>
  );
}
function EarnLunaBase({ className, depositAmount, depositAmountLuna }: any) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { connected } = useAccount();
  console.log(depositAmountLuna)


  // ---------------------------------------------
  // queries
  // ---------------------------------------------
   /*

    */
  // ---------------------------------------------
  // computes
  // ---------------------------------------------
  // ---------------------------------------------
  // dialogs
  // ---------------------------------------------
  const [openDepositDialog, depositDialogElement] = useDepositDialog('uluna');

  const [openWithdrawDialog, withdrawDialogElement] =
    useWithdrawDialog('uluna');

  const openDeposit = useCallback(async () => {
    await openDepositDialog();
  }, [openDepositDialog]);

  const openWithdraw = useCallback(async () => {
    await openWithdrawDialog();
  }, [openWithdrawDialog]);

/*  if (!connected) {
    return <EmptySection to="/earn">Go to Earn</EmptySection>;
  } */

  return (
    <>
      <Section className={className}>
      <div>
        <HorizontalScrollTable minWidth={600} startPadding={20}>
          <colgroup>
            <col style={{ minWidth: 150, maxWidth: 200 }} />
            <col style={{ minWidth: 100, maxWidth: 200 }} />
            <col style={{ minWidth: 150, maxWidth: 200 }} />
            <col style={{ minWidth: 300, maxWidth: 300 }} />
          </colgroup>
          <thead>
            <tr>
              <th></th>
              <th className={'right'}>
              <MyTool title="Current annualized deposit rate">
              APY
              </MyTool>
              </th>
              <th className={'right'}>
              <MyTool title="Total of all UST deposits including earnings">
              Total Balance
              </MyTool>
              </th>
              <th style={{textAlign:'center'}}><span style={{paddingLeft:"100px"}}>Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div>
          <Circles backgroundColors={['#172852']} radius={27}>
            <TokenIcon token="luna" style={{ height: '29px', width: '29px' }} />
          </Circles>
                  <div style={{ marginLeft: '20px' }}>
                    <div className="coin">LUNA</div>
                    <p className="name">Luna</p>
                  </div>
                </div>
              </td>
              <td className={'right'}>18.61%</td>
              <td className={'right'}>
                <span  className={"right"} style={{lineHeight:1.5}}>
                    {numberWithCommas(Number(demicrofy(Number(depositAmount))).toFixed(2))}{' '} <span> UST</span> <br/>
                    {
                    depositAmountLuna.div(10000).toFixed(2)
                    } Luna
                </span>
              </td>
              <td style={{ width: '450px', paddingLeft:"200px", paddingRight:"100px"}}>
                <DepositButtons coin={'uluna'} />
              </td>
            </tr>
          </tbody>
        </HorizontalScrollTable>
        </div>

        {depositDialogElement}
        {withdrawDialogElement}
      </Section>
    </>
  );
}

export const StyledEarnLuna = styled(EarnLunaBase)`
    .headRuler {
    color: none !important;
    background: none !important;
    box-shadow: inset 1px 1px 2px #2E2D2D, 1px 1px 2px #434040;
    }
  .right {
    
    text-align:right;
  }
  height:225px;
  .NeuSection-root {height: 225px;}
  .NeuSection-content { 
          padding: 25px 50px 15px 50px !important;
        height: 225px; 
        }

  .mobile-box {
    width: 50%;
    text-align: center;
    color: ${({ theme }) => theme.dimTextColor};
  }
    .coin-mobile {
        font-weight:bold;
    }
    .name-mobile {
        color: ${({ theme }) => theme.dimTextColor};
    }
  .mobile-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
  }
  button {
    font-size: 12px;
    width: 150px;
    height: 32px;

    &:first-child {
      margin-right: 8px;
    }
  }
  @media (max-width: 1000px) {
    margin-top: 60px;
  }
  table {
    thead {
      tr {
        th {
          font-weight: 860;
          padding: 5px 15px 15px 15px !important;
          font-size: 13px;
        }
      }
    }
    ,
    tbody {
      th:nth-child(2),
      td:nth-child(2),
      th:nth-child(3),
      td:nth-child(3),
      th:nth-child(4),
      td:nth-child(4) {
      }

      td {
        color: ${({ theme }) => theme.dimTextColor};
          font-size: 13px;
      }

      td:first-child > div {
        text-decoration: none;
        color: #ffffff;

        text-align: left;

        p {
          color: ${({ theme }) => theme.dimTextColor};
        }

        display: flex;

        align-items: center;

        i {
          width: 60px;
          height: 60px;

          margin-right: 15px;

          svg,
          img {
            display: block;
            width: 60px;
            height: 60px;
          }
        }

        .coin {
          font-weight: 860;
          font-size:20px;

          grid-column: 2;
          grid-row: 1/2;
        }

        .name {
          grid-column: 2;
          grid-row: 2;
        }
      }
    }

    button {
      font-size: 12px;
      width: 120px;
      height: 32px;

      &:first-child {
        margin-right: 8px;
      }
    }
  }

`;

export const StyledEarnUST = styled(EarnUSTBase)`
    .headRuler {
    color: none !important;
    background: none !important;
    box-shadow: inset 1px 1px 2px #2E2D2D, 1px 1px 2px #434040;
    }
  .right {
    
    text-align:right;
  }
  height:225px;
  .NeuSection-root {height: 225px;}
  .NeuSection-content { 
          padding: 25px 50px 15px 50px !important;
        height: 225px; 
        }

  .mobile-box {
    width: 50%;
    text-align: center;
    color: ${({ theme }) => theme.dimTextColor};
  }
    .coin-mobile {
        font-weight:bold;
    }
    .name-mobile {
        color: ${({ theme }) => theme.dimTextColor};
    }
  .mobile-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
  }
  button {
    font-size: 12px;
    width: 150px;
    height: 32px;

    &:first-child {
      margin-right: 8px;
    }
  }
  @media (max-width: 1000px) {
    margin-top: 60px;
  }
  table {
    thead {
      tr {
        th {
          font-weight: 860;
          padding: 5px 15px 15px 15px !important;
          font-size: 13px;
        }
      }
    }
    ,
    tbody {
      th:nth-child(2),
      td:nth-child(2),
      th:nth-child(3),
      td:nth-child(3),
      th:nth-child(4),
      td:nth-child(4) {
      }

      td {
        color: ${({ theme }) => theme.dimTextColor};
          font-size: 13px;
      }

      td:first-child > div {
        text-decoration: none;
        color: #ffffff;

        text-align: left;

        p {
          color: ${({ theme }) => theme.dimTextColor};
        }

        display: flex;

        align-items: center;

        i {
          width: 60px;
          height: 60px;

          margin-right: 15px;

          svg,
          img {
            display: block;
            width: 60px;
            height: 60px;
          }
        }

        .coin {
          font-weight: 860;
          font-size:20px;

          grid-column: 2;
          grid-row: 1/2;
        }

        .name {
          grid-column: 2;
          grid-row: 2;
        }
      }
    }

    button {
      font-size: 12px;
      width: 120px;
      height: 32px;

      &:first-child {
        margin-right: 8px;
      }
    }
  }
`;
export const Earn = fixHMR(EarnBase);
