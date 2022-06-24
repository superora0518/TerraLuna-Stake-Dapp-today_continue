import { computeCurrentAPY } from '@anchor-protocol/app-fns';
import {
  useAnchorWebapp,
  useEarnAPYHistoryQuery,
  useEarnEpochStatesQuery,
} from '@anchor-protocol/app-provider';
import{ Rate } from '@anchor-protocol/types';
import {
  APYChart,
  APYChart2,
  APYChartItem,
} from '@anchor-protocol/webapp-charts/APYChart';
import { formatRate } from '@libs/formatter';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { TooltipLabel } from '@libs/neumorphism-ui/components/TooltipLabel';
import { AnimateNumber } from '@libs/ui';
import big from 'big.js';
import React, { useMemo } from 'react';
import {StakeButton} from './TotalDepositSection'
import {styled} from '@material-ui/styles'
import {get} from 'http';
export interface InterestSectionProps {
  className?: string;
}

/*export function InterestSection({ className }: InterestSectionProps) {
  const { constants } = useAnchorWebapp();

  const { data: { apyHistory } = {} } = useEarnAPYHistoryQuery();

  const { data: { overseerEpochState } = {} } = useEarnEpochStatesQuery();

  const apy = useMemo(() => {
    return computeCurrentAPY(overseerEpochState, constants.blocksPerYear);
  }, [constants.blocksPerYear, overseerEpochState]);

  const apyChartItems = useMemo<APYChartItem[] | undefined>(() => {
    const history = apyHistory
      ?.map(({ Timestamp, DepositRate }) => ({
        date: new Date(Timestamp * 1000),
        value: (parseFloat(DepositRate) *
          constants.blocksPerYear) as Rate<number>,
      }))
      .reverse();

    return history && overseerEpochState
      ? [
          ...history,
          {
            date: new Date(),
            value: big(overseerEpochState.deposit_rate)
              .mul(constants.blocksPerYear)
              .toNumber() as Rate<number>,
          },
        ]
      : undefined;
  }, [apyHistory, constants.blocksPerYear, overseerEpochState]);

  return (<Section className="interest">
      <h2>
        <IconSpan>
          INTEREST <InfoTooltip>Current annualized deposit rate</InfoTooltip>
        </IconSpan>
      </h2>

      <div className="apy">
        <TooltipLabel
          className="name"
          title="Annual Percentage Yield"
          placement="top"
          style={{ border: 'none' }}
        >
          APY
        </TooltipLabel>
        <div className="value">
          <AnimateNumber format={formatRate}>{apy}</AnimateNumber>%
        </div>
        {apyChartItems && (
          <APYChart
            margin={{ top: 20, bottom: 20, left: 100, right: 100 }}
            gutter={{ top: 30, bottom: 20, left: 100, right: 100 }}
            data={apyChartItems}
            minY={() => -0.03}
            maxY={(...values) => Math.max(...values, 0.3)}
            style={{height:"100px"}}
            />
        )}
      </div>
  </Section>);
}
*/
export function InterestSectionDashLuna({ className, interestRate, coin, coinName }: InterestSectionProps) {
  const apyChartItems: APYChartItem[] = [{date:new Date("July 21, 1983 01:15:00"), value: interestRate},{date:new Date("July 21, 1983 01:15:00"), value: interestRate }]
  const getData = () => {
     const now = Date.now()
     var newDate = now
     var counter = 0
     var result = []
     while (counter < 100) {
        const item: APYChartItem = {date:newDate,value:interestRate}
        result.push(item)
        counter++
        newDate = (newDate - 86400000)

     }
     return result.reverse()
  }
  return (<>
      <div className="apy" style={{display:"flex", flexDirection:"column", marginTop:"10px", height:"370px"}}>
        <TooltipLabel
          className="name"
          title="Annual Percentage Yield"
          placement="top"
          style={{ border: 'none', textAlign:"center", width:"15%", alignSelf:"center", fontSize:"13px", fontWeight:"760", color:"#CEC0C0"}}
        >
          APY
        </TooltipLabel>
        <div className="value" style={{
            alignSelf:"center", 
            margin:"0px", 
            fontSize:"35px", 
            marginBottom:"30px", 
            marginTop:"18px", 
            fontWeight:"800"
            }}>
          <AnimateNumber format={formatRate}>{interestRate}</AnimateNumber>%
        </div>
        {apyChartItems && (
        <div style={{display:'flex', alignItems:"center", justifyContent:"center"}}>
          <APYChart2
            margin={{ top: 20, bottom: 20, left: 100, right: 100 }}
            gutter={{ top: 30, bottom: 20, left: 100, right: 100 }}
            data={getData()}
            minY={() => -0.03}
            maxY={(...values) => Math.max(...values, 0.9)}
            style={{height:"223px", maxWidth:"480px"}}
          />
         </div> 
        )}
      </div>
    <StakeButton coin={coin} coinName={coinName} />
  </>);
}
export function InterestSectionDashUST({ className, interestRate, coin, coinName }: InterestSectionProps) {
  const apyChartItems: APYChartItem[] = [{date:new Date("March 10, 2022 01:15:00"), value: interestRate},{date: Date.now(), value: interestRate }]
  const getData = () => {
     const now = Date.now()
     var newDate = now
     var counter = 0
     var result = []
     while (counter < 100) {
        const item: apyChartItem = {date:newDate,value:interestRate}
        result.push(item)
        counter++
        newDate = (newDate - 86400000)

     }
     return result.reverse()
  }
  return (<>
      <div className="apy" style={{display:"flex", flexDirection:"column", marginTop:"10px", height:"370px"}}>
        <TooltipLabel
          className="name"
          title="Annual Percentage Yield"
          placement="top"
          style={{ border: 'none', textAlign:"center", width:"15%", alignSelf:"center", fontSize:"13px", fontWeight:"760", color:"#CEC0C0"}}
        >
          APY
        </TooltipLabel>
        <div className="value" style={{
            alignSelf:"center", 
            margin:"0px", 
            fontSize:"35px", 
            marginBottom:"30px", 
            marginTop:"18px", 
            fontWeight:"800"
            }}>
          <AnimateNumber format={formatRate}>{interestRate}</AnimateNumber>%
        </div>
        {apyChartItems && (
        <div style={{display:'flex', alignItems:"center", justifyContent:"center"}}>
          <APYChart
            margin={{ top: 20, bottom: 20, left: 100, right: 100 }}
            gutter={{ top: 30, bottom: 10, left: 100, right: 100 }}
            data={getData()}
            minY={() => -0.03}
            maxY={(...values) => Math.max(...values, 0.9)}
            style={{height:"223px", maxWidth:"480px"}}
          />
         </div> 
        )}
      </div>
    <StakeButton coin={coin} coinName={coinName} />
  </>);
}
export function InterestSectionSlider({ className }: InterestSectionProps) {
  const { constants } = useAnchorWebapp();

  const { data: { apyHistory } = {} } = useEarnAPYHistoryQuery();

  const { data: { overseerEpochState } = {} } = useEarnEpochStatesQuery();


  const apyChartItems = useMemo<APYChartItem[] | undefined>(() => {
    const history = apyHistory
      ?.map(({ Timestamp, DepositRate }) => ({
        date: new Date(Timestamp * 1000),
        value: (parseFloat(DepositRate) *
          constants.blocksPerYear) as Rate<number>,
      }))
      .reverse();

    return history && overseerEpochState
      ? [
          ...history,
          {
            date: new Date(),
            value: big(overseerEpochState.deposit_rate)
              .mul(constants.blocksPerYear)
              .toNumber() as Rate<number>,
          },
        ]
      : undefined;
  }, [apyHistory, constants.blocksPerYear, overseerEpochState]);

  return (<>
      <div className="apy" style={{display:"flex", flexDirection:"column", marginTop:"30px", width:"90%"}}>
          <APYChart2
            margin={{ top: 20, bottom: 20, left: 150, right: 150 }}
            gutter={{ top: 30, bottom: 20, left: 100, right: 100 }}
            data={apyChartItems}
            minY={() => -0.03}
            maxY={(...values) => Math.max(...values, 0.3)}
            style={{height:"240px"}}
          />
      </div>
  </>);
}


const StyledStakeNow = styled(StakeButton)`
  @media (max-width: 1200px) {
    width: 90%;
  }
  width: 400px;
  padding: 21px;
  border-radius: 25px;
  background: #493b3b;
  font-weight: 720;
  letter-spacing: 0.03em;
  margin-top: 27px;
`;
 
