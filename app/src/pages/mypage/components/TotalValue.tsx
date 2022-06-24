import {
  useDeploymentTarget,
  useLunaExchange,
} from '@anchor-protocol/app-provider';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { formatUST } from '@anchor-protocol/notation';
import { u, UST } from '@anchor-protocol/types';
import { sum } from '@libs/big-math';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { AnimateNumber } from '@libs/ui';
import { SwapHoriz } from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import big, { Big, BigSource } from 'big.js';
import { Sub } from 'components/Sub';
import { useAccount } from 'contexts/account';
import { useBalances } from 'contexts/balances';
import { fixHMR } from 'fix-hmr';
import { useRewards } from 'pages/mypage/logics/useRewards';
import { useSendDialog } from 'pages/send/useSendDialog';
import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { ChartItem, DoughnutChart } from './graphics/DoughnutGraph';
import { numberWithCommas } from '../../dashboard/index';
import { Link } from 'react-router-dom';
import CircularView from './CircularView'
import {
  useAnchorBank,
  useDeposits,
} from '../../../@anchor-protocol/app-provider';
export interface TotalValueProps {
  className?: string;
}

interface Item {
  label: string;
  tooltip: string;
  amount: u<UST<BigSource>>;
  color: string;
}

function TotalValueBase({ className }: TotalValueProps) {
  const {
    target: { isNative },
  } = useDeploymentTarget();
  const { connected } = useAccount();
  const dataa = useDeposits();

  const tokenBalances = useBalances();

  const {
    ust: { formatOutput, demicrofy, symbol },
    // native: {formatOutput, demicrofy, symbol},
  } = useFormatters();

  const [openSend, sendElement] = useSendDialog();

  const [focusedIndex, setFocusedIndex] = useState(-1);

  const { ref, width = 400 } = useResizeObserver();

  const MINUTE_MS = 5000;

  const rate = useLunaExchange();
  const { totalValue, data, totalBalance } = useMemo<{
    totalValue: any;
    data: Item[];
    totalBalance: Item;
  }>(() => {
    const ust = tokenBalances.uUST;
    const theRate = rate ? rate : '0';

        
    return {
      totalBalance: {
        label: 'Total Balance',
        tooltip: 'Total amount of UST deposited and interest generated',
        color: '#6493F1',
        amount: rate
          ? big(dataa.luna.amount)
              .plus(dataa.luna.reward_amount)
              .mul(rate)
              .plus(dataa.ust.amount)
              .plus(dataa.ust.reward_amount)
          : big(0),
      },
      totalValue: rate
        ? big(dataa.luna.amount)
            .plus(dataa.luna.reward_amount)
            .mul(rate)
            .plus(dataa.ust.amount)
            .plus(dataa.ust.reward_amount)
            .plus(ust)
        : big(0),
      data: [
        {
          label: 'UST Wallet Balance',
          tooltip: 'Total amount of UST held',
          amount: ust ? ust : big(0),
          color: ['#F72585', '#493c3c'],
        },
        {
          label: 'UST Balance',
          tooltip: 'Total value of ANC and bAssets held',
          amount: dataa.ust
            ? big(dataa.ust.amount).plus(big(dataa.ust.reward_amount))
            : big(0),
          color: ['#6493F1', '#000000'],
        },
        {
          label: 'LUNA Balance',
          tooltip: 'Total value of ANC and bAssets held',
          amount: dataa.luna
            ? big(dataa.luna.amount)
                .plus(big(dataa.luna.reward_amount))
                .mul(big(theRate))
            : big(0),
          color: ['yellow', '#000000'],
        },
      ],
    };
  }, [tokenBalances.uUST, rate, dataa]);

  const isSmallLayout = useMemo(() => {
    return width < 470;
  }, [width]);

  //@ts-ignore
  const chartData = useMemo<ChartItem[]>(() => {
    let result = data.map(({ label, amount, color }) => ({
      label,
      value: +amount,
      color,
      total: big(totalValue).div(10)
    }));
    return result;
  }, [data, totalValue]);

  return (
    <Section
      className={className}
      data-small-layout={isSmallLayout}
      style={{ width: '695px' }}
    >
      <header ref={ref}>
        <div>
          <h4 style={{ height: '35px' }}>
            <IconSpan style={{ fontSize: '20px', fontWeight: '860' }}>
              TOTAL VALUE{' '}
              <InfoTooltip>
                Total value of deposits, borrowing, holdings, withdrawable
                liquidity, rewards, staked ANC, and UST held
              </InfoTooltip>
            </IconSpan>
          </h4>
          <p
            style={{
              fontWeight: 860,
              fontSize: '35px',
              marginTop: '-12px',
              marginBottom: '10px',
            }}
          >
            <AnimateNumber format={formatUST}>
              {String(big(totalValue).div(1000000).toFixed(2))}
            </AnimateNumber>
            <Sub> UST</Sub>
          </p>
        </div>
        {isNative && (
          <div style={{ fontSize: '9px' }}>
            <a
              href="https://app.terraswap.io/swap?to=&type=swap&from=uluna"
              style={{ textDecoration: 'inherit' }}
            >
              <BorderButton
                disabled={!connected}
                style={{ height: '25px', width: '92px', fontSize: '9px' }}
              >
                <SwapHoriz style={{ fontSize: '20px' }} />
                Swap
              </BorderButton>
            </a>
          </div>
        )}
      </header>

      <div className="values">
        <ul>
          <li
            key={'Total Balance'}
            style={{ color: 'black' }}
            data-focus={3 === focusedIndex}
          >
            <i
              style={{
                borderRadius: '2px',
                marginTop: '4px',
                height: '14px',
                width: '14px',
              }}
            />
            <p>
              <IconSpan style={{ fontSize: '20px', fontWeight: 'bold' }}>
                Total Balance{' '}
                <InfoTooltip>
                  Total amount of UST deposited and interest generated.
                </InfoTooltip>
              </IconSpan>
            </p>
            <p style={{ fontStyle: 'italic', color: '#d8d0cd' }}>
              {totalBalance &&
                //@ts-ignore
                formatOutput(
                  big(totalBalance!.amount.toString()).div(1000000).toFixed(2),
                )}
              {` ${symbol}`}
            </p>
          </li>
          {data.map(({ label, tooltip, amount, color }, i) => (
            <li
              key={label}
              style={{ color: color[0] }}
              data-focus={i === focusedIndex}
            >
              <i style={{ borderRadius: '2px', marginTop: '4px' }} />
              <p>
                <IconSpan style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  {label} <InfoTooltip>{tooltip}</InfoTooltip>
                </IconSpan>
              </p>
              <p style={{ fontStyle: 'italic', color: '#d8d0cd' }}>
                {
                  //@ts-ignore
                  formatOutput(big(amount.toString()).div(1000000).toFixed(2))
                }
                {` ${symbol}`}
              </p>
            </li>
          ))}
        </ul>

        {!isSmallLayout && (
          <div style={{ marginRight: '10%' }}>
            {tokenBalances !== undefined && (
              <DoughnutChart data={chartData!} onFocus={setFocusedIndex} />
            )}

          </div>
        )}
      </div>

      {sendElement}
    </Section>
  );
}

export const StyledTotalValue = styled(TotalValueBase)`
  letter-spacing: -0.06em !important;
  i {
    background-color: currentColor;

    position: absolute;
    left: -17px;
    top: 5px;

    display: inline-block;
  }
  .NeuSection-content {
  }
  header {
    display: flex;
    justify-content: space-between;

    h4 {
      font-size: 12px;
      font-weight: 860;
      margin-bottom: 5px;
    }

    p {
      font-size: clamp(20px, 8vw, 32px);
      font-weight: 860;

      sub {
        font-size: 20px;
        font-weight: 800;
      }
    }

    button {
      font-size: 14px;
      padding: 0 13px;
      height: 26px;
      width: 100px;
      border-color: #c4c4c4;
      svg {
        font-size: 1em;
        margin-right: 0.3em;
      }
    }
  }

  .NeuSection-root {
    max-height: 434px;
  }

  .values {
    margin-top: 5px;

    display: flex;
    justify-content: space-between;

    ul {
      padding: 0 0 0 12px;
      list-style: none;
      margin-left: 7px;

      display: inline-grid;
      grid-template-rows: repeat(4, auto);
      grid-auto-flow: column;
      grid-row-gap: 10px;
      grid-column-gap: 50px;

      li {
        position: relative;

        i {
          background-color: currentColor;

          position: absolute;
          left: -17px;
          top: 5px;

          display: inline-block;
          min-width: 13px;
          min-height: 13px;
          transition: transform 0.3s ease-out, border-radius 0.3s ease-out;
        }

        p:nth-of-type(1) {
          font-size: 12px;
          font-weight: 500;
          line-height: 1.5;

          color: ${({ theme }) => theme.textColor};
        }

        p:nth-of-type(2) {
          font-size: 13px;
          line-height: 1.5;

          color: ${({ theme }) => theme.textColor};
        }

        &[data-focus='true'] {
          i {
            transform: scale(1.1);
            border-radius: 10%;
          }
        }
      }
    }

    canvas {
      min-width: 230px;
      min-height: 230px;
      max-width: 230px;
      max-height: 230px;
    }
  }

  &[data-small-layout='true'] {
    header {
      flex-direction: column;

      button {
        margin-top: 1em;

        width: 100%;
      }
    }

    .values {
      margin-top: 30px;
      display: block;

      ul {
        display: grid;
      }

      canvas {
        display: none;
      }
    }
  }
`;

export const TotalValue = fixHMR(StyledTotalValue);
