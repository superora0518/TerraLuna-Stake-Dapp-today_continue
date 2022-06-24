import { PaddedLayout } from 'components/layouts/PaddedLayout';
import { FlexTitleContainer, PageTitle } from 'components/primitives/PageTitle';
import { links, screen } from 'env';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';
import { BuyUstButton } from './components/BuyUstButton';
import { ExpectedInterestSection } from './components/ExpectedInterestSection';
import { InsuranceCoverageButton } from './components/InsuranceCoverageButton';
import { TotalDepositSection, DepositButtons } from './components/TotalDepositSection';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { Divider } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { InterestSectionDash } from '../earn/components/InterestSection';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Circles } from 'components/primitives/Circles';
import { TooltipLabel } from '@libs/neumorphism-ui/components/TooltipLabel';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import {  MyTool } from '@libs/neumorphism-ui/components/InfoTooltip';
import { AnimateNumber } from '@libs/ui';
export interface EarnProps {
  className?: string;
}

function Component({ className }: EarnProps) {
  return (
    <PaddedLayout className={className}>
      <FlexTitleContainer>
        <PageTitle title="EARN" docs={links.docs.earn} />
      </FlexTitleContainer>
      <section className="grid">
        <TotalDepositSection className="total-deposit" />
        <DepositLuna />
        <DepositUST />
        <ExpectedInterestSection className="expected-interest" />
      </section>
    </PaddedLayout>
  );
}

const DepositLuna = () => {
  return (
    <>
      <Section className="deposit2">
        <div
          style={{ display: 'flex', flexDirection: 'column'}}
        >
          <div
            style={{
              marginLeft: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ alignSelf: 'center' }}>
              <Circles backgroundColors={['#063970']}>
                <TokenIcon token="luna" style={{height:"2.1em"}} />
              </Circles>
            </div>

            <Typography
              style={{
                alignSelf: 'center',
                marginRight: 0,
                marginTop: 20,
                fontWeight: 'bolder',
                fontSize:'30px',
              }}
            >
              LUNA
            </Typography>
            <div className="apy" style={{margin:'26px'}}>
              <TooltipLabel
                className="name"
                title="Annual Percentage Rate"
                placement="top"
                style={{ border: 'none', margin: 0, paddingTop:'10px', paddingBottom:'10px', paddingLeft:'32px', paddingRight:'32px' }}
              >
              <span style={{fontSize: '13px', fontWeight:'860', color:'#CEC0C0'}}>APY</span>
              </TooltipLabel>
              <div className="value" style={{ margin: 0, fontStyle:'italic', width: '92px', textAlign: 'center'}}>
              <MyTool title="Current annualized deposit rate">
                18.61%
              </MyTool>
              </div>
            </div>
            <Divider sx={{ borderBottomWidth: 3, width: '488px' }} style={{height:"2px", boxShadow: '1px 1px 1px #434040 '}}/>
            <div style={{ alignSelf: 'center' }}>
            <DepositButtons coin={"uluna"}/>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};
const DepositUST = () => {
  return (
    <>
      <Section className="deposit1">
        <div
          style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          <div
            style={{
              marginLeft: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ alignSelf: 'center', margin: 0 }}>
                <TokenIcon token="ust" style={{height:"80px", width:"100%"}} />
            </div>

            <Typography
              style={{
                alignSelf: 'center',
                marginRight: 0,
                marginTop: 6,
                fontWeight: 'bolder',
                fontSize:'30px',
              }}
            >
              UST
            </Typography>
            <div className="apy" style={{margin:'26px'}}>
              <TooltipLabel
                className="name"
                placement="none"
                style={{ border: 'none', margin: 0, paddingTop:'10px', paddingBottom:'10px', paddingLeft:'32px', paddingRight:'32px' }}
              >
              <span style={{fontSize: '13px', fontWeight:'860', color:'#CEC0C0'}}>APY</span>
              </TooltipLabel>
              <div className="value" style={{ margin: 0, fontStyle:'italic', width: '92px', textAlign: 'center'}}>
              <MyTool title="Current annualized deposit rate">
                34.87%
              </MyTool>
              </div>
            </div>
            <Divider sx={{ borderBottomWidth: 3, width: '488px' }} style={{height:"2px", boxShadow: '1px 1px 1px #434040 '}}/>
            <div style={{ alignSelf: 'center' }}>
            <DepositButtons coin={"uusd"}/>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

const Buttons = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 700px) {
    width: 100%;
    gap: 0;
    justify-content: stretch;
    flex-direction: column;
  }
`;

const StyledComponent = styled(Component)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  .border {
    border: 1px solid #CEBFBF !important;

  }
  letter-spacing: -0.06em;
  h2 {
    margin: 0;
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.textColor};
  }

  hr {
    margin: 20px 0;
  }
  Button {
    border:none;
  }
  ul li {
    div {
    border:none;
    }
  }
  .deposit1 {
    Button {
      height:45px;
      width:200px;
      margin:10px;
      border:none;
    }
  }
  .deposit2 {
    Button {
      height:45px;
      width:200px;
      margin:10px;
      border:none;
    }
  }

  .decimal-point {
    color: ${({ theme }) => theme.dimTextColor};
  }

  .deposit1{
   .NeuSection-content {

        display:flex
        flex-direction: column
        padding-left:20px;
        padding-right:20px;
  }
  }
  .deposit2{
   .NeuSection-content {
        display:flex
        flex-direction: column
        padding-left:20px;
        padding-right:20px;
  }
  }
  .apy{
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
    font-weight: 400;
  }
  .total-deposit {
    .NeuSection-content {
        height: 288px;
        padding 60px 50px 50px 50px !important;
        display: flex;
        flex-direction:column;
        justify-content:space-between;
    }
    .amount {

      .denom {
        font-size: 18px;
      }
    }

    .total-deposit-buttons {
      margin-top: 64px;
    }
  }

  .interest {
    .apy {
      text-align: center;
      

      .name {
        margin-bottom: 5px;
      }

      .value {
        font-size: 50px;
        font-weight: 860;
        color: #ffffff ;
        margin-bottom: 50px;
      }

      figure {
        width: 50%;
        height: 300px;
      }
    }
  }

  .expected-interest {
  ul {
    padding:0;
  }
    div {

        div { 
                box-shadow:none;

        }
    }
    .amount {
      font-size: 32px;
      font-weight: 500;
      letter-spacing: -0.6px;

      .denom {
        font-size: 18px;
      }
    }

    .tab {
      margin-top: 64px;
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  .total-deposit {
    h2 {
      margin-bottom: 15px;
    }

    .total-deposit-buttons {
      display: grid;
      grid-template-columns: repeat(2, 142px);
      justify-content: end;
      grid-gap: 20px;
    }
  }

  .interest {
    h2 {
      margin-bottom: 10px;
    }
  }

  .expected-interest {
    h2 {
      margin-bottom: 15px;
    }
  }

  // pc
  @media (min-width: ${screen.monitor.min}px) {
    .grid {
      max-width:1222px;
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      grid-auto-rows: minmax(288px, auto);
      grid-template-areas:
        'hd hd hd hd   hd   hd   hd   hd'
        'sd sd sd sd  main  main main main'
        'ft ft ft ft ft ft ft ft';
      grid-gap: 60px;
      margin-bottom: 40px;
      .deposit1{
        grid-area:sd;
        max-height:421px;
        width:582px;
        .NeuSection-content {
        padding: 50px 50px 50px 50px !important;
        max-height:421px;
        width:582px;

        }
        .NeuSection-root {
        max-height:421px;
        width:582px;

        }
    
      }
      .deposit2{
        grid-area:main;
        max-height:421px;
        width:582px;
        .NeuSection-content {
        padding: 50px 50px 50px 50px !important;
        max-height:421px;
        width:582px;

        }
        .NeuSection-root {
        max-height:421px;
        width:582px;

        }
      }
      .NeuSection-root {
        margin: 0;
      }

      .total-deposit {
      grid-area:hd;
      max-height:288px;
      }

      .interest {
        grid-column: 3;
        grid-row: 3/3;
      }

      .expected-interest {
        max-height:294px;
        grid-area:ft;
      }
    }

    .interest {
      .NeuSection-content {
        padding: 60px 40px;
      }
    }
  }

  // under pc
  @media (max-width: ${screen.pc.max}px) {
    .interest {
      .apy {
        figure {
          height: 180px;
        }
      }
    }

    .expected-interest {
      height: unset;
    }
  }

  // mobile
  @media (max-width: ${screen.mobile.max}px) {
    .decimal-point {
      display: none;
    }

    .total-deposit {
      h2 {
        margin-bottom: 10px;
      }

      .amount {
        font-size: 40px;
      }

      .total-deposit-buttons {
        margin-top: 30px;
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 15px;
      }
    }

    .interest {
      .apy {
        figure {
          height: 150px;
        }
      }
    }

    .expected-interest {
      h2 {
        margin-bottom: 10px;
      }

      .amount {
        font-size: 40px;
      }

      .tab {
        margin-top: 30px;
      }
    }
  }
`;

export const Earn = fixHMR(StyledComponent);
