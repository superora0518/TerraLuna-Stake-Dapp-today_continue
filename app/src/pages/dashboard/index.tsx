import { formatUST } from '@anchor-protocol/notation';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { Rate, u, UST } from '@anchor-protocol/types';
import { useTvl } from '@anchor-protocol/app-provider';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import big from 'big.js'
import {
  horizontalRuler,
  pressed,
  verticalRuler,
} from '@libs/styled-neumorphism';
import { AnimateNumber } from '@libs/ui';
import { BigSource } from 'big.js';
import { PageTitle, TitleContainer } from 'components/primitives/PageTitle';
import { screen } from 'env';
import { fixHMR } from 'fix-hmr';
import React, { useEffect, useState, useMemo } from 'react';
import styled, { css, useTheme } from 'styled-components';
import {
  NewChart,
  NewChartCalc,
  NewChartEntire,
  LockedChart
} from './components/ANCPriceChart';
import { TotalValueLockedDoughnutChart } from './components/TotalValueLockedDoughnutChart';
import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';
import { Divider } from '@material-ui/core';
import {
  InterestSectionDashUST,
  InterestSectionDashLuna,
} from '../earn/components/InterestSection';
import { Circles } from 'components/primitives/Circles';
import { Typography, Input, Slider, Theme } from '@material-ui/core';
import { withStyles, makeStyles, createStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { StablecoinChart } from './components/StablecoinChart';
import { useAccount } from 'contexts/account';
import { useTvlHistoryUST, useTvlHistoryLuna } from './logics/useTvlHistory';
import { useLunaExchange, useTheTVL} from '@anchor-protocol/app-provider';
import { PaddedLayout } from '../../components/layouts/PaddedLayout';
import { getData } from './components/ANCPriceChart';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      display: 'block',
      marginTop: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }),
);

function ThumbComponent(props: any) {
  return (
    <span {...props}>
      <span className="bar" />
      <span className="bar" />
      <span className="bar" />
    </span>
  );
}

export function numberWithCommas(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const EarningCalc = (props: any) => {
  const ControlledOpenSelect = (props: any) => {
    const classes = useStyles();
    const [age, setAge] = React.useState<string | number>('');
    const [open, setOpen] = React.useState(false);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      if (event.target.value === 0.000955342) {
        setChoice([event.target.value, 'UST']);
      }
      if (event.target.value === 0.000509863) {
        setChoice([event.target.value, 'LUNA']);
      }
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleOpen = () => {
      setOpen(true);
    };

    return (
      <div>
        <FormControl
          className={classes.formControl}
          style={{
            width: '100%',
            marginRight: 35,
            marginLeft: 0,
            fontWeight: '800',
          }}
        >
          <Select
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={choice[0]}
            onChange={handleChange}
            defaultValue={0.000509863}
            style={{ fontSize: '20px' }}
          >
            <MenuItem value={0.000509863}>Luna</MenuItem>
            <MenuItem value={0.000955342}>UST</MenuItem>
          </Select>
        </FormControl>
      </div>
    );
  };

  const theme = useTheme();

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [amount, setAmount] = useState<any>(1000);
  const [choice, setChoice] = useState<any[]>([0.000509863, 'LUNA']);
  const [years, setYears] = useState<any>(10);
  const [interestEarnedResult, setInterestEarnedResult] =
    useState<any>(5433.67);
  const [amountEarnedResult, setAmountEarnedResult] = useState<any>(6433.67);

  const onChangeSlider = (
    e: any,
    newValue: number | number[],
    lunaUustExchangeRate: any,
  ) => {
    let i = 0;
    const days = Number(newValue) * 365;
    const start = amount;
    var lunaResult = [];
    var runningTotal = amount;
    runningTotal += runningTotal * Number(choice[0]);
    while (i <= days) {
      runningTotal += runningTotal * choice[0];
      i++;
    }
    setAmountEarnedResult(runningTotal.toFixed(2));
    setInterestEarnedResult((runningTotal - start).toFixed(2));

    setYears(newValue);
  };

  const onChangeInput = (e: any) => {
    console.log(e.target.value);
    setAmount(Number(e.target.value));
  };
  return (
    <Section className="stablecoin">
      <Typography
        style={{
          fontSize: '20px',
          fontFamily: 'SF UI Text',
          letterSpacing: '-0.06em',
          fontWeight: '800',
        }}
      >
        HOW MUCH CAN I EARN??
      </Typography>

      <div className="NeuSection-content2">
        <div className="input-formatter">
          <div className="fields-input">
            <div className="fields-deposit">
              <ControlledOpenSelect choice={choice} setChoice={setChoice} />
              <h2 className="deposit-text">Your Deposit</h2>
            </div>
            <div className="fields-amount">
              <CoolInput
                defaultValue={1000}
                onChange={onChangeInput}
                classes={{
                  underline: 'underline-input',
                  input: 'input-styles',
                  root: 'input-root',
                }}
                className={'input-styling'}
              ></CoolInput>

              <h2 className="amount-text">Amount in UST</h2>
            </div>
            <div className="fields-slider">
              <Typography
                style={{
                  fontWeight: 800,
                  fontSize: 20,
                }}
                className="earn-years"
              >
                {years} Years
              </Typography>
              <CoolSlider
                ThumbComponent={ThumbComponent}
                size="small"
                aria-label="Small"
                valueLabelDisplay="auto"
                step={1}
                max={10}
                min={1}
                onChange={onChangeSlider}
                defaultValue={10}
                className="earn-slider"
              />
            </div>
          </div>
        </div>

        <Divider
          orientation="vertical"
          flexItem
          style={{
            width: '1px',
            height: '304px',
            marginRight: '40px',
            marginLeft: '40px',
          }}
          className="earn-divider"
        />
        <div className="bottom-wrap">
          <div
            className="bottom-total"
            style={{ width: '250px', overflow: 'visible', zIndex: 1 }}
          >
            <header style={{ alignSelf: 'start' }}>
              <p className="amount" style={{ whiteSpace: 'nowrap' }}>
                $ {numberWithCommas(Number(interestEarnedResult))}
                <span>UST</span>
              </p>
              <h2>Interest Earned</h2>
              <div />
            </header>
            <header
              style={{
                alignSelf: 'start',
                fontWeight: '740',
                display: 'inline',
              }}
            >
              <span>
                <p className="amount" style={{ whiteSpace: 'nowrap' }}>
                  $ {numberWithCommas(Number(amountEarnedResult))}
                  <span>UST</span>
                </p>
                <h2>Total</h2>
              </span>
              <div />
            </header>
            <header>
              <h2>
                <i style={{ backgroundColor: theme.colors.secondary }} /> TT
                Performance
              </h2>
              <h2>
                <i style={{ backgroundColor: 'black' }} /> Traditional Market
              </h2>
            </header>
          </div>
          <div
            style={{
              alignSelf: 'end',
              width: '550px',
              height: '343px',
              zIndex: 2,
            }}
          >
            <NewChartCalc rate={choice[0]} amount={amount} years={years} />
          </div>
        </div>
      </div>
    </Section>
  );
};

export interface DashboardProps {
  className?: string;
}

const StakeYours = () => {
  const theme = useTheme();
  const interestRateLuna = 0.1861 as Rate<number>;
  const interestRateUST = 0.3487 as Rate<number>;
  return (
    <>
      <Section className="staking1">
        <div
          style={{
            alignSelf: 'left',
            display: 'inline-flex',
          }}
        >
          <span style={{ marginTop: '3px' }}>
            <TokenIcon token="ust" style={{ height: '56px', width: '56px' }} />
          </span>
          <div style={{ marginLeft: '15px' }}>
            <Typography style={{ fontSize: '30px', fontWeight: '760' }}>
              <div style={{ width: '200px', marginBottom: '-8px' }}>UST</div>
            </Typography>
            <div>
              <div style={{ width: '200px', display: 'inline-flex' }}>
                <h2 style={{ fontSize: '13px', fontWeight: '800' }}>
                  INTEREST
                </h2>
                <div
                  style={{
                    alignSelf: 'start',
                    marginTop: '-3px',
                    marginLeft: '5px',
                  }}
                >
                  <InfoTooltip style={{ width: '12px' }}>
                    <Typography style={{ fontWeight: 800 }}>
                      Current annualized deposit rate
                    </Typography>
                  </InfoTooltip>
                </div>
              </div>
              <br />
            </div>
          </div>
        </div>
        <div className="staking-apy" style={{ alignSelf: 'left' }}>
          <InterestSectionDashUST
            className="interest"
            coin={'uusd'}
            coinName={'UST'}
            interestRate={interestRateUST}
          />
        </div>
      </Section>

      <Section className="staking2">
        <div
          style={{
            alignSelf: 'left',
            display: 'inline-flex',
          }}
        >
          <span style={{ marginTop: '3px' }}>
            <Circles backgroundColors={['#172852']} radius={27}>
              <TokenIcon
                token="luna"
                style={{ height: '29px', width: '29px' }}
              />
            </Circles>
          </span>
          <div style={{ marginLeft: '15px' }}>
            <Typography style={{ fontSize: '30px', fontWeight: '760' }}>
              <div style={{ width: '200px', marginBottom: '-8px' }}>LUNA</div>
            </Typography>
            <div>
              <div style={{ width: '200px', display: 'inline-flex' }}>
                <h2 style={{ fontSize: '13px', fontWeight: '800' }}>
                  INTEREST
                </h2>
                <div
                  style={{
                    alignSelf: 'start',
                    marginTop: '-3px',
                    marginLeft: '5px',
                  }}
                >
                  <InfoTooltip style={{ width: '12px' }}>
                    <Typography style={{ fontWeight: 800 }}>
                      Current annualized deposit rate
                    </Typography>
                  </InfoTooltip>
                </div>
              </div>
              <br />
            </div>
          </div>
        </div>
        <div className="staking-apy" style={{ alignSelf: 'left' }}>
          <InterestSectionDashLuna
            className="interest"
            coin={'uluna'}
            coinName={'LUNA'}
            interestRate={interestRateLuna}
          />
        </div>
      </Section>
    </>
  );
};

const EMPTY_ARRAY: any[] = [];

function DashboardBase({ className }: DashboardProps) {
  const theme = useTheme();
  const lunaUustExchangeRate = useLunaExchange();

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [tvlAmmt, setTVLAmmt] = useState<number>(0.0);
  const [changed, setChanged] = useState<boolean>(false);

  const dataa = useTheTVL()

  const {tvl, tvlHistory, tvlLuna, tvlUST, change} = useMemo<{ 
    tvl:big, 
    tvlHistory: any,
    tvlLuna: big,
    tvlUST: big, 
    change: big
  }>(()=>{
      
    if (lunaUustExchangeRate && dataa){
      const luna = big(dataa[dataa.length - 1].luna_amount).mul(lunaUustExchangeRate).plus(dataa[dataa.length -1].ust_amount) 
       const totalLuna = big(dataa[dataa.length- 1].luna_amount).mul(lunaUustExchangeRate).div(1000000)
       const totalUST = big(dataa[dataa.length - 1].ust_amount).div(1000000)
       const startLuna = big(dataa[0].luna_amount).mul(lunaUustExchangeRate).div(1000000)
       const startUST = big(dataa[0].ust_amount).div(1000000)
       const start = startUST.plus(startLuna)
       const end = totalUST.plus(totalLuna)
       const change = start.div(end)
       console.log(change.toFixed())
       return {tvl: luna ? luna.div(1000000) : big(0), tvlHistory:dataa, tvlLuna: totalLuna, tvlUST: totalUST, change: change }
    }
    return {tvl: big(0), tvlHistory:dataa, tvlUST: big(0), tvlLuna: big(0), change: big(0) }
    },[dataa, lunaUustExchangeRate])
  console.log(tvl.toFixed(2))

  useEffect(() => {
    function handler() {
      setIsMobile(window.innerWidth < 500);
    }

    window.addEventListener('resize', handler);
    handler();

    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);

  return (
    <PaddedLayout className={className}>
      <main>
        <div className="content-layout">
          <TitleContainerAndExchangeRate>
            <PageTitle title="DASHBOARD" />
          </TitleContainerAndExchangeRate>

          <div className="summary-section">
            <Section className="total-value-locked" style={{ gridArea: 'hd' }}>
              <div
                style={{
                  alignSelf: 'start',
                  justifyContent: 'start',
                }}
              >
                <div className="donutChartSecion">
                  <div className="tvlTitle">
                    <Typography
                      style={{
                        fontSize: '20px',
                        fontWeight: '740',
                        fontStyle: 'normal',
                      }}
                    >
                      TOTAL VALUE LOCKED
                    </Typography>
                    <div className="percents" style={{ height: '36px' }}>
                      <p className="amount">
                        <AnimateNumber format={formatUST}>
                          {tvl
                            ? String(tvl)
                            : (0 as u<UST<number>>)}
                        </AnimateNumber>
                        <span style={{ fontWeight: '760' }}>UST</span>
                      </p>

                      <div
                        style={{
                          marginTop: '23px',
                          marginLeft: '-5px',
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                      >
                        {!changed && (
                          <ArrowDropUp
                            style={{ color: '#00B929', fontSize: '40px' }}
                          />
                        )}
                        {changed && (
                          <ArrowDropDown
                            style={{ color: 'red', fontSize: '40px' }}
                          />
                        )}
                        <div
                          style={{
                            color: '#00B929',
                            fontSize: '14px',
                            marginLeft: '-6px',
                          }}
                        >
                          {changed &&
                            lunaUustExchangeRate !== undefined && (
                              <span style={{ color: 'red' }}>{change.toFixed(2)}%</span>
                            )}
                          {!changed &&
                            lunaUustExchangeRate !== undefined && (
                              <span>{change.toFixed(2)}%</span>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <figure className="tvlBottom" style={{ marginTop: '20px' }}>
                    <div className="chart">
                      <TotalValueLockedDoughnutChart
                        totalDeposit={tvlUST.toString() as u<UST>}
                        totalCollaterals={tvlLuna.toString() as u<UST>}
                        totalDepositColor={theme.colors.secondary}
                        totalCollateralsColor={theme.textColor}
                      />
                    </div>
                    <div className="tvl-balances" style={{height:'190px'}}>
                      <h3>
                        <i
                          style={{ backgroundColor: theme.colors.secondary }}
                        />{' '}
                        LUNA
                      </h3>
                      <div
                        className="tvl-money"
                        style={{ display: 'inline-flex' }}
                      >
                        <p style={{ marginRight: '4px', fontStyle: 'italic' }}>
                          ${' '}
                        </p>
                        <p style={{ fontStyle: 'italic' }}>
                          <AnimateNumber format={formatUST}>
                            {tvlLuna
                              ? String(tvlLuna)
                              : '0'}
                          </AnimateNumber>
                        </p>
                      </div>
                      <h3>
                        <i style={{ backgroundColor: '#000000' }} /> UST
                      </h3>
                      <div
                        className="tvl-money"
                        style={{ display: 'inline-flex' }}
                      >
                        <p style={{ marginRight: '4px', fontStyle: 'italic' }}>
                          ${' '}
                        </p>
                        <p style={{ fontStyle: 'italic' }}>
                          <AnimateNumber format={formatUST}>
                            {tvlUST 
                              ? String(tvlUST)
                              : '0'}
                          </AnimateNumber>
                        </p>
                      </div>
                    </div>
                  </figure>
                </div>
              </div>
              <Divider
                orientation="vertical"
                flexItem
                style={{
                  width: '1px',
                  height: '300px',
                  marginRight: '50px',
                  marginLeft: '30px',
                  marginTop: '25px',
                  marginBottom: '25px',
                  borderLeft: 'none',
                  alignSelf: 'center',
                  color: '#5C5353',
                }}
                className="topDiv new-chart"
              />
              {/*tvlHistoryUST !== undefined &&
                tvlHistoryLuna !== undefined &&
                lunaUustExchangeRate !== undefined && (
                  <NewChart
                    tvlHistoryLuna={tvlHistoryLuna}
                    tvlHistoryUST={tvlHistoryUST}
                    lunaUustExchangeRate={lunaUustExchangeRate}
                  />
                  )*/}
              {dataa && lunaUustExchangeRate &&
                <LockedChart rate={lunaUustExchangeRate} data={tvlHistory} />}
            </Section>
            <StakeYours />
            <EarningCalc lunaUustExchangeRate={lunaUustExchangeRate} />
            <Section style={{ gridArea: 'fr' }} className={'entire-tvl'}>
              <Typography
                style={{
                  fontWeight: '800',
                  fontSize: '20px',
                  marginBottom: '1px',
                }}
              >
                TVL OF THE ENTIRE ECOSYSTEM
              </Typography>
              {tvlAmmt && (
                <p style={{ fontWeight: '800', fontSize: '35px' }}>
                  <AnimateNumber format={formatUST}>
                    {String(tvlAmmt) as u<UST<BigSource>>}
                  </AnimateNumber>{' '}
                  <span style={{ fontSize: '20px' }}>UST</span>
                </p>
              )}

              <NewChartEntire setTVLAmmt={setTVLAmmt} />
            </Section>
          </div>
        </div>
      </main>
    </PaddedLayout>
  );
}

const CoolSlider = withStyles({
  root: {
    color: '#F9D85E',
    height: 3,
    padding: '0',
    marginLeft: 5,
    marginTop: '-30px',
    marginBottom: '20px',
  },
  thumb: {
    'height': 20,
    'width': 20,
    'backgroundColor': '#F9D85E',
    'border': '1px solid currentColor',
    'marginTop': -10,
    'marginLeft': -13,
    '&:focus, &:hover, &$active': {},
    '& .bar': {
      // display: inline-block !important;
      height: 3,
      width: 1,
      backgroundColor: 'currentColor',
      marginLeft: 1,
      marginRight: 1,
    },
  },
  active: {},
  track: {
    height: 3,
    marginLeft: '-5px',
  },
  rail: {
    color: '#d8d8d8',
    opacity: 1,
    height: 3,
    marginLeft: '-5px',
  },
})(Slider);

const CoolInput = styled(Input)`
  width: 254px;
  border-bottom: 1px !important;
  font-size: 20px !important;
  fontweight: 800;
`;

const TitleContainerAndExchangeRate = styled(TitleContainer)`
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  > :nth-child(2) {
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -6%;

    small {
      font-size: 0.8em;
    }

    img {
      transform: scale(1.2) translateY(0.1em);
    }
  }

  @media (max-width: 700px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    > :nth-child(2) {
      font-size: 18px;
    }
  }
`;

const hHeavyRuler = css`
  padding: 0;
  margin: 0;

  border: 0;

  height: 5px;
  border-radius: 3px;

  ${({ theme }) =>
    pressed({
      color: theme.sectionBackgroundColor,
      distance: 1,
      intensity: theme.intensity,
    })};
`;

const hRuler = css`
  ${({ theme }) =>
    horizontalRuler({
      color: theme.sectionBackgroundColor,
      intensity: theme.intensity,
    })};
`;

const vRuler = css`
  ${({ theme }) =>
    verticalRuler({
      color: theme.sectionBackgroundColor,
      intensity: theme.intensity,
    })};
`;

const StyledDashboard = styled(DashboardBase)`
  letter-spacing:-.06em !important;
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};
      div.tvl-balances {
        align-self: center;
      }
  .tvl-money {
    p {
        color: #ffffff;
        margin-bottom:0px;
    }
  }
  .input-root {
    font-size:20px;
    font-weight:800;
  }
  .input-styles {
    font-size:20px;
    font-weight:800;
    bottom: 0;
  }
  .underline-input: before {
  }
    .new-chart {
        height:237px;
        width:647px;
    }
  h2 {
    font-size: 13px;
    font-weight: 500;
    color:${({ theme }) => theme.dimTextColor};
    span {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 22px;
      margin-left: 10px;
      background-color: ${({ theme }) => theme.colors.positive};
      color: ${({ theme }) => theme.highlightBackgroundColor};

      &[data-negative='true'] {
        background-color: ${({ theme }) => theme.colors.negative};
      }
    }
  }
    .entire-tvl {
            height: 454px;
         
        .NeuSection-root {
            height: 454px;
        }
        .NeuSection-content {
            height: 454px;
        
        }
        
    }
    .apy {
      figure {
        width:100%;
      }
    }  
    h3 {
      font-size: 20px;
      font-weight: 800;
      color: ${({ theme }) => theme.textColor};
    }
    .airbnb-bar: {
      height: 9,
      width: 1,
      backgroundColor: 'currentColor',
      marginLeft: 1,
      marginRight: 1,
    }
    .input-formatter {
        margin: auto;
    }
    .fields-input {
    
      .fields-deposit {
        margin-top: 10px;
        margin-bottom: 10px;
        .deposit-text {
            font-weight: 800;
            font-size: 9px;
            
        }
      }
      .fields-amount {
        margin-top: 10px;
        margin-bottom: 10px;
        .amount-text {
            margin-top: 5px;
            font-weight: 800;
            font-size: 9px;
        }
      }
      .fields-slider {
        .earn-years {
          margin-bottom:12px;
        }
        margin-top: 10px;
        margin-bottom: 10px;

      }
      width: 254px;
      display: flex;
      flex-direction:column;
    }
  .NeuSection-content {
        padding: 50px;
      }
  .bottom-wrap {
      width: 100%;
      display: flex;
      margin:0;
      width: -webkit-fill-available;
    }
  .bottom-total {
      display: flex;
      flex-direction: column;
      justify-content:center;
      align-items:space-around;
    }
  .amount {
      font-size: 35px;
      font-weight: 800;

      span:last-child {
      margin-left: 8px;
      font-size: 0.555555555555556em;
      } 
  }
  .percents {
    display: inline-flex;
    align-items:center;
    
  }
  .tvlBottom {
        display: flex;
        align-items: start;
  }

  .staking1 {
        height:615px;
        width:582px;
      .NeuSection-root {
        height:615px;
        width:582px;

      }
    .NeuSection-content {
        height:615px;
        width:582px;
      height:"100%";
      display: flex !important;
      flex-direction: column;
      justify-content: center !important;
      align-items: left;
    }
    }
  .staking2 {
        height:615px;
        width:582px;
      .NeuSection-root {
        height:615px;
        width:582px;

      }
    .NeuSection-content {
        height:615px;
        width:582px;
      height:"100%";
      display: flex !important;
      flex-direction: column;
      justify-content: center !important;
      align-items: left;
    }
    }
  .total-value-locked {

    .NeuSection-content {
      height:434px;
        .topDiv {
            box-shadow:none;
        }
          width:100%;
          display: flex !important;
          align-items: center;
          justify-content: start;
        }
    Section {
    }
    figure {
      > .chart {
        width:100%;
        height:237px;
        margin-right:56px;
        margin-left:15px;
      }


      > div {
        h3 {
          display: flex;
          align-items: center;

          i {
            display: inline-block;
            width: 15px;
            height: 15px;
            margin-right: 10px;
            border-radius: 3px;
          }

          margin-bottom: 5px;
        }

        p {
          font-size: 14px;
          font-weight:400;

          &:nth-of-type(1) {
            margin-bottom: 25px;
          }
        }
      }
    }
  }

  .anc-price {
    header {
      display: flex;
      align-items: center;

      > div:first-child {
        flex: 1;
      }

      > div:not(:first-child) {
        h3 {
          margin-bottom: 10px;
        }

        p {
          font-size: 18px;

          span:last-child {
            margin-left: 5px;
            font-size: 12px;
          }
        }

        &:last-child {
          margin-left: 30px;
        }
      }

      margin-bottom: 15px;
    }

    figure {
      > div {
        width: 100%;
        height: 220px;
      }
    }
  }

  .anc-buyback > .NeuSection-content {
    display: flex;
    justify-content: space-between;

    max-width: 1000px;

    padding: 40px 60px;


    section {
      div {
        display: flex;

        p {
          display: inline-block;

          font-size: 27px;
          font-weight: 600;

          word-break: keep-all;
          white-space: nowrap;

          span {
            font-size: 0.666666666666667em;
            margin-left: 5px;
            color: ${({ theme }) => theme.dimTextColor};
          }

          &:first-child {
            margin-right: 20px;
          }
        }
      }
    }
  }
  .stablecoin {
    font-weight:800;
        height:454px;
  .NeuSection-content {
    height:454px;
  }
  .NeuSection-root {
    height:454px;
  }
  .NeuSection-content2 {
        display:inline-flex;
        flex-direction:row;
        width:100%;
        max-height: 300px;
  }
    header {
      h2 {
        font-weight:800 !important;
        font-size: 9px;
        margin-bottom: 5px;
        margin-top: 5px;
        i {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 3px;
          margin-right: 3px;
          transform: translateY(1px);
        }
      }

    }

    figure {
      > div {
        width: 100%;
        height: 220px;
      }
    }
  }

  .collaterals {
    header {
      margin-bottom: 15px;
    }

    figure {
      > div {
        width: 100%;
        height: 220px;
      }
    }
  }

  .stablecoin-market,
  .basset-market {
    margin-top: 40px;

    table {
      thead {
        th {
          text-align: right;

          &:first-child {
            font-weight: bold;
            color: ${({ theme }) => theme.textColor};
            text-align: left;
          }
        }
      }

      tbody {
        td {
          text-align: right;

          .value,
          .coin {
            font-size: 16px;
          }

          .volatility,
          .name {
            font-size: 13px;
            color: ${({ theme }) => theme.dimTextColor};
          }

          &:first-child > div {
            text-decoration: none;
            color: currentColor;

            text-align: left;

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
              font-weight: bold;

              grid-column: 2;
              grid-row: 1/2;
            }

            .name {
              grid-column: 2;
              grid-row: 2;
            }
          }
        }
      }
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  main {
    .content-layout {
      width: fit-content;
      margin: auto;
    }
  }

    .tvlBottom {
        align-self:start;
        margin-left:-10px;
    }
      .tvlTitle {
        align-self: baseline;
        margin-bottom: 30px;
      }

  // pc


  // align section contents to origin
  @media (min-width: 1001px) {
    .summary-section {
      max-width: 1222px;
      width: 1222px;
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      grid-auto-rows: minmax(434px, auto);
      grid-template-areas:
        'hd hd hd hd   hd   hd   hd   hd'
        'sd sd sd sd  main  main main main'
        'ft ft ft ft ft ft ft ft'
        'fr fr fr fr fr fr fr fr';
      grid-gap: 60px;
      margin-bottom: 40px;
      .donutChartSecion {

        display: flex;
        flex-direction: column;
        height:100%;
        padding-right:82px;
      }
      .NeuSection-root {
        margin-bottom: 0;
        width: 100%;
      }
      .NeuSection-content {
        width: 100%;
      }
    .fields-input {
      h2 {
        margin-top: 0px;
      }
    }

      .stablecoin {
        grid-area: ft;
        header {
          h2 {
            i {
              display: inline-block;
              width: 12px;
              height: 12px;
              border-radius: 3px;
              margin-right: 3px;
              transform: translateY(1px);
            }
          }

          margin-bottom: 15px;
        }

        figure {
          > div {
            width: 100%;
            height: 220px;
          }
        }
      }

      .collaterals {
        header {
          margin-bottom: 15px;
        }

        figure {
          > div {
            width: 100%;
            height: 220px;
          }
        }
      }

      .stablecoin-market,
      .basset-market {
        margin-top: 40px;

        table {
          thead {
            th {
              text-align: right;

              &:first-child {
                font-weight: bold;
                color: ${({ theme }) => theme.textColor};
                text-align: left;
              }
            }
          }

          tbody {
            td {
              text-align: right;

              .value,
              .coin {
                font-size: 16px;
              }

              .volatility,
              .name {
                font-size: 13px;
                color: ${({ theme }) => theme.dimTextColor};
              }

              &:first-child > div {
                text-decoration: none;
                color: currentColor;

                text-align: left;

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

                  grid-column: 2;
                  grid-row: 1/2;
                }

                .name {
                  grid-column: 2;
                  grid-row: 2;
                }
              }
            }
          }
        }
      }
      .staking1 {
        grid-area: sd;
        .NeuSection-content {
          display: flex !important;
          flex-direction: column;
          justify-content: center !important;
          align-items: left;
        }
      }
      .staking2 {
        grid-area: main;
        .NeuSection-content {
          display: flex !important;
          flex-direction: column;
          justify-content: center !important;
          align-items: left;
        }
      }

      .total-value-locked {
        NeuSection-root {
            display:inline-block;
        .NeuSection-content {
            certical-align:middle;
            margin: 0 auto;
          display: flex !important;
          align-items: center;
          justify-content: center;
          padding-left: 50px;
          padding-right: 50px;
          padding-top: 25px;
          padding-bottom: 25px;
        }
      }
      }
      .anc-price {
        grid-column: 2/4;
        grid-row: 1/5;
      }

      .anc-buyback {
        grid-column: 2/4;
        grid-row: 5/6;
      }
    }
  }

  // align section contents to horizontal
  @media (min-width: 700px) and (max-width: 1000px) {
    .NeuSection-root { 
        max-width:600px;
        }
    
    .fields-input {
      h2 {
      }
    }


        .new-chart {
            visibility: hidden;
            display:none;
        }
      .total-value-locked > .NeuSection-content {
        hr {
          ${vRuler};
          margin-left: 60px;
          margin-right: 60px;
          margin-top:40px;
          margin-bottom:40px;
          box-shadow: none;
          
        }
      }
    }

    .stablecoin {
      grid-area: ft;
      header {
        grid-template-columns: repeat(2, 1fr);

        > div:empty {
          display: none;
        }
      }
    }
  }

  // under tablet
  // align section contents to horizontal
  @media (max-width: 699px) {
    .summary-section {
    
      margin:1%;
    }
     Section {
       max-width:500px;}
    .NeuSection-root { 
        max-width:600px;
        }

        .new-chart {
            visibility: hidden;
            display:none;
        }
    h1 {
      margin-bottom: 20px;
    }

    h2 {
      span {
        padding: 3px 7px;
      }
    }

    .amount {
      font-size: 28px;
    }

    .NeuSection-root {
        margin-right:0;
      .NeuSection-content {
        padding: 30px;
        width:auto;
        margin: 0;
      }
    }

    .summary-section {
    .chart-div {
        visibility: hidden;
        display:none;
        
    }
      .total-value-locked {
        display: block;

        hr {
          ${hHeavyRuler};
          margin-top: 30px;
          margin-bottom: 30px;
        }

        figure {
          > div {
            p {
              font-size: 16px;
            }
          }
        }
      }

      .anc-price {
        header {
          display: block;

          > div:first-child {
            margin-bottom: 10px;
          }

          > div:not(:first-child) {
            display: grid;
            grid-template-columns: 160px 1fr;
            grid-template-rows: 28px;
            align-items: center;

            h3 {
              margin: 0;
            }

            p {
              font-size: 16px;

              span:last-child {
                margin-left: 5px;
                font-size: 12px;
              }
            }

            &:first-child {
              flex: 1;

              p {
                font-size: 36px;
                font-weight: 700;

                span {
                  font-size: 20px;
                }
              }
            }

            &:last-child {
              margin-left: 0;
            }
          }

          margin-bottom: 15px;
        }
      }

      .anc-buyback > .NeuSection-content {
        display: block;

        section {
          div {
            display: block;

            p {
              display: block;

              font-size: 20px;

              margin-top: 0.5em;
            }
          }
        }
      }
    }

    .stablecoin {
      header {
        display: block;

        > div:first-child {
          margin-bottom: 15px;
        }

        > div:empty {
          display: none;
        }
      }
    }

    .stablecoin-market,
    .basset-market {
      table {
        tbody {
          td {
            .value,
            .coin {
              font-size: 15px;
            }

            .volatility,
            .name {
              font-size: 12px;
            }

            &:first-child > div {
              i {
                width: 50px;
                height: 50px;

                margin-right: 10px;

                svg,
                img {
                  display: block;
                  width: 50px;
                  height: 50px;
                }
              }
            }
          }
        }
      }
    }
  }

  // under mobile
  // align section contents to vertical
  @media (max-width: ${screen.mobile.max}px) {

  main {
    .content-layout {
      margin: 1%;
    }
  }
    .summary-section {
    }
    .fields-input {
      .bottom-total {
        margin:0;
      }
      .earn-years {
        margin-top:20px;
      }
      .earn-slider {
        margin-top:30px;
      }
      h2 {
        margin:10px;
      }
    }


    .fields-input {
      width: 100% ;
    }
    
    .NeuSection-root {
      .NeuSection-content {
        height:100%;
      }
    }
    .NeuSection-content2 {
      .earn-divider {
          display:none;
          visibility:hidden;
      }
      flex-direction:column;
    }
    .apy {
      figure {
        width:90%;
        .date-tag {
          transform: translateX(-16px);
        }
      }
    }
  .tvl-balances {
    align-self: center;
    margin-bottom:30px;
  }
  .tvlBottom {
        display: flex;
        align-items: center;
        flex-direction:column;
  }
      .staking1 {
        .NeuSection-content {
          display: flex !important;
          flex-direction: column;
          justify-content: center !important;
          align-items: left;
        }
      }
      .staking2 {
        .NeuSection-content {
          display: flex !important;
          flex-direction: column;
          justify-content: center !important;
          align-items: left;

          figure {
          
          }
        }
      }
        .new-chart {
            visibility: hidden;
            display:none;
        }
    h1 {
      margin-bottom: 10px;
    }

    figure {
      > .chart {

        margin-right: 44px;
      }
    .NeuSection-root {
      margin-bottom: 40px;

      .NeuSection-content {
        padding: 20px;
      }
    }

    .summary-section {
      .total-value-locked {
    .chart-div {
        visibility: hidden;
        display:none;
        
    }

          > div {
            p:nth-of-type(1) {
              margin-bottom: 12px;
            }
          }
        }
      }
    }
  }

  @media (min-width: 1400px) and (max-width: 1500px) {
    .anc-buyback > .NeuSection-content {
      section {
        div {
          p {
            font-size: 20px;
          }
        }
      }
    }
  }
`;

export const Dashboard = fixHMR(StyledDashboard);
