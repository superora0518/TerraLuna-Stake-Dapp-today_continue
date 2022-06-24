import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { MarketAncHistory } from '@anchor-protocol/app-fns';
import big from 'big.js';
import { Chart } from 'chart.js';
import React, { Component, createRef } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { mediumDay } from './internal/axisUtils';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { de } from 'date-fns/locale';
import axios from 'axios';
import { ChartTooltip } from './ChartTooltip';
import { numberWithCommas } from '..';

export interface ANCPriceChartProps {
  data: MarketAncHistory[];
  theme: DefaultTheme;
  isMobile: boolean;
}
export class ANCPriceChart extends Component<ANCPriceChartProps> {
  private canvasRef = createRef<HTMLCanvasElement>();
  private tooltipRef = createRef<HTMLDivElement>();
  private chart!: Chart;
  state = {
    sumData: null,
  };

  render() {
    this.setState({
      // labels: ["02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00", "00:00"],
      datasets: [
        {
          label: 'Cubic interpolation (monotone)',
          data: [
            { x: new Date('1649463245'), y: 5463 },
            { x: new Date('1649462245'), y: 3463 },
            { x: new Date('1649461245'), y: 6463 },
            { x: new Date('1649460245'), y: 7463 },
            { x: new Date('1649453245'), y: 8463 },
            { x: new Date('1649443245'), y: 9463 },
          ],
          //data: this.props.data.map(({ anc_price }) =>
          //  big(anc_price).toNumber(),
          // ),
          cubicInterpolationMode: 'monotone',
          tension: 1.7,
          borderColor: this.props.theme.colors.secondary,
          borderWidth: 4,
          fill: { target: 'origin', above: this.getGradient() },
        },
      ],
    });
    return (
      <>
        <Line data={this.state.sumData} />
      </>
    );
  }

  componentWillUnmount() {
    this.chart?.destroy();
  }

  shouldComponentUpdate(nextProps: Readonly<ANCPriceChartProps>): boolean {
    return (
      this.props.data !== nextProps.data ||
      this.props.theme !== nextProps.theme ||
      this.props.isMobile !== nextProps.isMobile
    );
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate(prevProps: Readonly<ANCPriceChartProps>) {
    /*  if (prevProps.data !== this.props.data) {
            this.chart.data.labels = xTimestampAxis(
              this.props.data.map(({ timestamp }) => timestamp),
            );
            this.chart.data.datasets[0].data = this.props.data.map(({ anc_price }) =>
              big(anc_price).toNumber(),
            );
          }
      
          if (prevProps.theme !== this.props.theme) {
            if (this.chart.options.scales?.x?.ticks) {
              this.chart.options.scales.x.ticks.color = this.props.theme.dimTextColor;
            }
            if (this.chart.options.scales?.y?.ticks) {
              this.chart.options.scales.y.ticks.color = this.props.theme.dimTextColor;
            }
            this.chart.data.datasets[0].borderColor =
              this.props.theme.colors.secondary;
          }
      
          if (prevProps.isMobile !== this.props.isMobile) {
            if (
              this.chart.options.scales?.x?.ticks &&
              'maxRotation' in this.chart.options.scales.x.ticks
            ) {
              this.chart.options.scales.x.ticks.maxRotation = this.props.isMobile
                ? undefined
                : 0;
            }
          } 
      
          this.chart.update(); */
  }
  private getGradient = () => {
    const myChartRef = this.canvasRef.current.getContext('2d');

    let gradientLine = myChartRef.createLinearGradient(0, 0, 0, 400);
    gradientLine.addColorStop(0, 'rgba(27,228,158,0.5)');
    gradientLine.addColorStop(0.35, 'rgba(25,185,128,0.3)');
    gradientLine.addColorStop(0.9, 'rgba(0,212,255,0)');
    return gradientLine;
  };
  private createChart = () => {
    this.chart = new Chart(this.canvasRef.current!, {
      type: 'line',
      plugins: [
        {
          id: 'custom-y-axis-draw',
          afterDraw: (chart) => {
            const ctx = chart.ctx;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';

            ctx.restore();
          },
        },
      ],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },

          tooltip: {
            enabled: false,

            external: ({ chart, tooltip }) => {
              let element = this.tooltipRef.current!;
              if (tooltip.opacity === 0) {
                element.style.opacity = '0';
                return;
              }

              const div1 = element.querySelector('div:nth-child(1)');
              const hr = element.querySelector('hr');

              if (div1) {
                try {
                  const i = tooltip.dataPoints[0].dataIndex;
                  const isLast = i === this.props.data.length - 1;
                  const item = this.props.data[i];
                  const price = formatUSTWithPostfixUnits(item.anc_price);
                  const date = isLast ? 'Now' : mediumDay(item.timestamp);
                  div1.innerHTML = `${price} UST <span>${date}</span>`;
                } catch {}
              }

              if (hr) {
                hr.style.top = chart.scales.y.paddingTop + 'px';
                hr.style.height = chart.scales.y.height + 'px';
              }

              element.style.opacity = '1';
              element.style.transform = `translateX(${tooltip.caretX}px)`;
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          x: {
            //@ts-ignore
            min: new Date('1649463245'),
            //@ts-ignore
            max: new Date('1649443245'),
            ticks: {
              display: false,
            },
            grid: {
              display: false,
            },
            type: 'time',
            offset: true,
            time: {
              unit: 'hour',
            },
          },
          y: {
            ticks: {
              display: false,
            },
            beginAtZero: true,
            grid: {
              display: false,
              drawBorder: false,
            },
          },
        },
        elements: {
          point: {
            radius: 0,
          },
        },
      },
      data: {
        labels: [
          '02:00',
          '04:00',
          '06:00',
          '08:00',
          '10:00',
          '12:00',
          '14:00',
          '16:00',
          '18:00',
          '20:00',
          '22:00',
          '00:00',
        ],
        datasets: [
          {
            label: 'Cubic interpolation (monotone)',
            data: [
              0.0, 2.4, 4.2, 6.4, 8.2, 12.0, 16.2, 20.5, 24.1, 29.0, 34.4, 39.1,
              44.4,
            ],
            //data: this.props.data.map(({ anc_price }) =>
            //  big(anc_price).toNumber(),
            // ),
            cubicInterpolationMode: 'monotone',
            tension: 1.7,
            borderColor: this.props.theme.colors.secondary,
            borderWidth: 4,
            fill: { target: 'origin', above: this.getGradient() },
            options: {},
          },
        ],
      },
    });
  };
}

const Container = styled.div`
  width: inherit;
  position: relative;
`;
export const LockedChart = ({data, rate}) => {
  const [chart, setChart] = React.useState<Chart | undefined>(undefined);

  let canvasRef = createRef<HTMLCanvasElement>();
  let tooltipRef = React.useRef<HTMLDivElement>();

  const createChart = () => {
    if(canvasRef.current == null)
      return;

    var canvas = canvasRef.current;
    var ctx = canvas?.getContext('2d');
    var gradient = ctx?.createLinearGradient(0, 0, 0, 400);
    gradient?.addColorStop(0, 'rgba(10, 147, 150, 0.21)');   
    gradient?.addColorStop(0.9, 'rgba(255, 255, 255, 0)');

    if(chart != undefined)
      chart.destroy();

    let _chart = new Chart(canvasRef.current, {
      type: 'line',
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
                  /*const i = tooltip.dataPoints[0].dataIndex;
                  const item = data[i];

                  div1.innerHTML = `${new Date(item.time * 1000).toString().slice(1,10)}`;
                  div2.innerHTML = `$${big(item.luna_amount).mul(rate).plus(item.ust_amount).div(1000000).toFixed(2)}`;
                   */
              enabled: false,

              external: ({ chart, tooltip }) => {
                let element = tooltipRef.current!;

                if (tooltip.opacity === 0) {
                  element.style.opacity = '0';
                  return;
                }

                const div1 = document.getElementById('div4');
                const hr = document.getElementById('hr4');
                

                if (div1) {
                  try {
                    const i = tooltip.dataPoints[0].dataIndex;
                    const item = data.datasets[0].data[i];
                    console.log(item)
                    const deposits = big(item.luna_amount).mul(rate).plus(item.ust_amount).div(1000000).toFixed(2);
                    const date = new Date(item.time * 1000).toString().slice(1,10);;

                    div1.innerHTML = `
                    <span>$  UST ${date
                      .toString()
                      .slice(0, 10)}
                    </span>`;
                  } catch {}
                }

                if (hr) {
                  hr.style.top = chart.scales.y.paddingTop + 'px';
                  hr.style.height = chart.scales.y.height + 'px';
                }

                element.style.opacity = '1';
                element.style.transform = `translateX(${tooltip.caretX}px)`;
              },
            },

          },
              interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          x: {
            grid: {
              borderColor: '#434040',
              display: false,
              drawBorder: false,
            },
            ticks: {
              display: false,
            },
          },
          y: {
            // grace: '0%',
            display: false,
          },
        },
        elements: {
          point: {
            radius: 0,
            hoverRadius: 10,
            backgroundColor: '#F9D85E'
          },
        },
      },
      data: {
        labels: data.map(({ time }) => time.toString()),
        datasets: [
          {
            data: data.map(({ ust_amount, luna_amount }) =>
            (Number(ust_amount) + Number(luna_amount)).toString(),
            ),
            borderColor: "#F9D85E",
            borderWidth: 2,
            fill: {
              target: 'origin',
              above: gradient,   // Area will be red above the origin
            }
          },
        ],
      },
    });
    setChart(_chart);

  };

  React.useEffect(()=>{
    if(data.length == 0)
      return;

    createChart()
  }, [data])

  return (
    <div style={{width: '100%', position: 'relative', height: '330px', marginTop:'30px'}}>
      <canvas ref={canvasRef} id= 'lockedChart'/>
      <ChartTooltip ref={tooltipRef} id="tt">
        <hr id="hr4" />
        <div
          id="div4"
          style={{
            backgroundColor: '#493C3C',
            padding: '5px 7px 5px 7px',
            fontSize: '10px',
            borderRadius: '20px',
          }}
        ></div>
      </ChartTooltip>
      </div>      
  );
}



export const NewChartEntire = (props: any) => {
  let tooltipRef = React.useRef<HTMLDivElement>();
  const getGradient = () => {
    const canvas = document.createElement('canvas');
    const myChartRef = canvas.getContext('2d');

    let gradientLine = myChartRef.createLinearGradient(0, 0, 0, 400);
    gradientLine.addColorStop(0, 'rgba(10, 147, 150, 0.21)');
    //gradientLine.addColorStop(0.5, "rgba(25,185,128,0.3)");
    gradientLine.addColorStop(0.8, 'rgba(255, 255, 255, 0)');
    return gradientLine;
  };
  const [entireTVL, setEntireTVL] = React.useState({
    data: [
      { x: '2021-08-08T13:12:23', y: 3 },
      { x: '2021-08-08T13:12:45', y: 5 },
      { x: '2021-08-08T13:12:46', y: 6 },
      { x: '2021-08-08T13:13:11', y: 3 },
      { x: '2021-08-08T13:14:23', y: 9 },
      { x: '2021-08-08T13:16:45', y: 1 },
    ],
  });
  const MINUTE_MS = 15000;

  React.useEffect(() => {
    const interval = setInterval(() => {
      axios.get('https://api.llama.fi/charts/terra').then(function (response) {
        // handle success
        setEntireTVL(response);
      });
    }, MINUTE_MS);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    axios.get('https://api.llama.fi/charts/terra').then(function (response) {
      // handle success
      setEntireTVL(response);
    });
  }, []);
  const getData = (histories: any) => {
    let finalArray = [];

    histories.data.map((item, i) => {
      return finalArray.push({
        x: Number(item.date),
        y: item.totalLiquidityUSD,
      });
    });
    if (finalArray.length > 200) {
      props.setTVLAmmt(finalArray.pop().y);
      return finalArray.splice(300);
    } else {
      props.setTVLAmmt(finalArray.pop().y);
      return finalArray;
    }
  };

  const data = {
    datasets: [
      {
        data: getData(entireTVL),

        /*data: [
                    {x: '2021-08-08T13:12:23', y: 3},
                    {x: '2021-08-08T13:12:45', y: 5},
                    {x: '2021-08-08T13:12:46', y: 6},
                    {x: '2021-08-08T13:13:11', y: 3},
                    {x: '2021-08-08T13:14:23', y: 9},
                    {x: '2021-08-08T13:16:45', y: 1}
                ],*/
        //data: this.props.data.map(({ anc_price }) =>
        //  big(anc_price).toNumber(),
        // ),
        tension: 0.5,
        borderColor: 'rgb(251, 216, 93)',
        borderWidth: 2,
        pointRadius: 0.5,
        fill: { target: 'origin', above: getGradient() },
      },
    ],
  };

  return (
    <Container className="new-chart-entire" style={{ marginTop: '-30px' }}>
      <Line
        data={data}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            //@ts-ignore
            tooltip: {
              enabled: false,

              external: ({ chart, tooltip }) => {
                let element = tooltipRef.current!;

                if (tooltip.opacity === 0) {
                  element.style.opacity = '0';
                  return;
                }

                const div1 = document.getElementById('div2');
                const hr = document.getElementById('hr2');

                if (div1) {
                  try {
                    const i = tooltip.dataPoints[0].dataIndex;
                    const isLast = i === data.datasets[0].data.length - 1;
                    const item = data.datasets[0].data[i];
                    const deposits = item.y;
                    const borrows = item.y;
                    const date = new Date(item.x);

                    div1.innerHTML = `
                    <span>$ ${numberWithCommas(deposits.toFixed(2))} UST ${date
                      .toString()
                      .slice(0, 10)}
                    </span>`;
                  } catch {}
                }

                if (hr) {
                  hr.style.top = chart.scales.y.paddingTop + 'px';
                  hr.style.height = chart.scales.y.height + 'px';
                }

                element.style.opacity = '1';
                element.style.transform = `translateX(${tooltip.caretX}px)`;
              },
            },

            legend: { display: false },
          },
              interaction: {
          intersect: false,
          mode: 'index',
        },

          scales: {
            x: {
              offset: true,

              type: 'time',
              time: {
                unit: 'minute',
                //@ts-ignore
                min: String(data.datasets[0].data[0].x),
                max: String(data.datasets[0].data.pop().x),
              },
              bounds: 'data',
              ticks: {
                display: false,
                autoSkipPadding: 30,
              },
              grid: {
                display: false,
              },
            },

            y: {
              beginAtZero: false,
              ticks: {
                display: false,
              },
              grid: {
                display: false,
                drawBorder: false,
              },
            },

            //@ts-ignore
          },
        }}
        height={320}
        width={'100%'}
        style={{ border: 'none' }}
      />
      <ChartTooltip ref={tooltipRef} id="tt">
        <hr id="hr2" />
        <section
          id="div2"
          style={{
            backgroundColor: '#493C3C',
            padding: '5px 7px 5px 7px',
            fontSize: '10px',
            borderRadius: '20px',
          }}
        ></section>
      </ChartTooltip>
    </Container>
  );
};
export const getData = (
  lunaHistory: any,
  ustHistory: any,
  lunaUustExchangeRate: any,
) => {
  var answer = [];
  let finalArray = [{ x: Date.now() - 210857000, y: 0 }];


  lunaHistory[0].state.map((item: any) => {
    if (item.tvl !== '0') {
      const lunaTvlUST = lunaUustExchangeRate.mul(
        big(item.tvl).div(big(1000000)).toNumber(),
      );
      const lunaUSTConvert = lunaTvlUST.toFixed(2);
      return answer.push({ x: item.epoch * 1000, y: lunaUSTConvert });
    }
  });
  var answer2 = [];
  ustHistory[0].state.map((item: any) => {
    if (item.tvl !== '0') {
      const ust = big(item.tvl).div(big(1000000));
      const ustTvl = ust.toFixed(2);
      return answer2.push({ x: item.epoch * 1000, y: Number(ustTvl) });
    }
  });

  if (answer.length < answer2.length) {
    const timeVarianceIndex = answer2.length - answer.length;
    let secondIndex = 0;
    answer2.map((item, i) => {
      if (i < timeVarianceIndex) {
        return finalArray.push({ x: item.x, y: item.y });
      }
      return (
        finalArray.push({
          x: item.x,
          y: Number(answer[secondIndex].y) + Number(item.y),
        }),
        secondIndex++
      );
    });
  }
  if (answer2.length < answer.length) {
    const timeVarianceIndex = answer.length - answer2.length;
    let secondIndex = 0;
    answer.map((item, i) => {
      if (i < timeVarianceIndex) {
        return finalArray.push({ x: item.x, y: item.y });
      }
      return (
        finalArray.push({
          x: item.x,
          y: Number(answer2[secondIndex].y) + Number(item.y),
        }),
        secondIndex++
      );
    });
  }
  if (answer2.length === answer.length) {
    answer.map((item, i) => {
      return finalArray.push({
        x: item.x,
        y: Number(answer2[i].y) + Number(item.y),
      });
    });
  }

  finalArray[0].x = finalArray[0].x - 259200000;
  return finalArray;
};

export const NewChart = (props: any) => {
  let tooltipRef = React.useRef<HTMLDivElement>();
  const getGradient = () => {
    const canvas = document.createElement('canvas');
    const myChartRef = canvas.getContext('2d');

    let gradientLine = myChartRef.createLinearGradient(0, 0, 0, 400);
    gradientLine.addColorStop(0, 'rgba(10, 147, 150, 0.21)');
    //gradientLine.addColorStop(0.5, "rgba(25,185,128,0.3)");
    gradientLine.addColorStop(0.85, 'rgba(255, 255, 255, 0)');
    return gradientLine;
  };
  const data = {
    //labels: ["02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00", "00:00"],
    datasets: [
      {
        label: false,
        data: getData(
          props.tvlHistoryLuna,
          props.tvlHistoryUST,
          props.lunaUustExchangeRate,
        ),
        /*data: [
                    {x: '2021-08-08T13:12:23', y: 3},
                    {x: '2021-08-08T13:12:45', y: 5},
                    {x: '2021-08-08T13:12:46', y: 6},
                    {x: '2021-08-08T13:13:11', y: 3},
                    {x: '2021-08-08T13:14:23', y: 9},
                    {x: '2021-08-08T13:16:45', y: 1}
                ],*/
        //data: this.props.data.map(({ anc_price }) =>
        //  big(anc_price).toNumber(),
        // ),
        tension: 0.05,
        borderColor: 'rgb(251, 216, 93)',
        borderWidth: 2,
        pointRadius: 1,
        fill: { target: 'origin', above: getGradient() },
      },
    ],
  };
  return (
    <Container className="new-chart">
      {data.datasets.length > 0 && (
        <Line
          //@ts-ignore
          data={data!}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
              //@ts-ignore
              tooltip: {
                enabled: false,

                external: ({ chart, tooltip }) => {
                  let element = tooltipRef.current!;

                  if (tooltip.opacity === 0) {
                    element.style.opacity = '0';
                    return;
                  }

                  const div1 = document.getElementById('divv');
                  const hr = document.getElementById('hr1');

                  if (div1) {
                    try {
                      const i = tooltip.dataPoints[0].dataIndex;
                      const isLast = i === data.datasets[0].data.length - 1;
                      const item = data.datasets[0].data[i];
                      const deposits = item.y;
                      const borrows = item.y;
                      const date = new Date(item.x);

                      div1.innerHTML = `
                    <span>$ ${deposits} UST ${date.toString().slice(0, 10)}
                    </span>`;
                    } catch {}
                  }

                  if (hr) {
                    hr.style.top = chart.scales.y.paddingTop + 'px';
                    hr.style.height = chart.scales.y.height + 'px';
                  }

                  element.style.opacity = '1';
                  element.style.transform = `translateX(${tooltip.caretX}px)`;
                },
              },

              legend: { display: false },
            },
              interaction: {
          intersect: false,
          mode: 'index',
        },
            scales: {
              x: {
                offset: true,

                type: 'time',
                time: {
                  unit: 'hour',
                  //@ts-ignore
                  //min: String((Date.now()-2419200)),
                },
                bounds: 'data',
                ticks: {
                  display: false,
                },
                grid: {
                  display: false,
                },
              },

              y: {
                beginAtZero: true,
                ticks: {
                  display: false,
                },
                grid: {
                  display: false,
                  drawBorder: false,
                },
              },

              //@ts-ignore
            },
          }}
          height={400}
          width={'100%'}
          style={{ maxWidth: '100%' }}
        ></Line>
      )}
      <ChartTooltip ref={tooltipRef} id="tt">
        <hr id="hr1" />
        <section
          id="divv"
          style={{
            backgroundColor: '#493C3C',
            padding: '5px 7px 5px 7px',
            fontSize: '10px',
            borderRadius: '20px',
          }}
        ></section>
      </ChartTooltip>
    </Container>
  );
};

export const NewChartCalc = (props: any) => {
  let tooltipRef = React.useRef<HTMLDivElement>();
  const getGradient = () => {
    const canvas = document.createElement('canvas');
    const myChartRef = canvas.getContext('2d');

    let gradientLine = myChartRef.createLinearGradient(0, 0, 0, 400);
    gradientLine.addColorStop(0, 'rgba(10, 147, 150, 0.21)');
    //gradientLine.addColorStop(0.5, "rgba(25,185,128,0.3)");
    gradientLine.addColorStop(0.8, 'rgba(255, 255, 255, 0)');
    return gradientLine;
  };
  const getDataTraditional = (rate: number, years: number, amount: number) => {
    const days = years * 365 + 60;
    const now = Date.now();
    var newDate = now;
    var finalArray = [];
    var runningTotal = amount;
    var i = 0;
    while (i <= days) {
      if (i === 0) {
        finalArray.push({ x: newDate, y: runningTotal });
      }
      if (i % 30 === 0) {
        finalArray.push({ x: newDate, y: runningTotal });
      }
      runningTotal += runningTotal * rate;
      newDate = newDate + 86400000;

      i++;
    }
    return finalArray;
  };

  const getData = (rate: number, years: number, amount: number) => {
    const days = years * 365;
    const now = Date.now();
    var newDate = now;
    var finalArray = [];
    var runningTotal = amount;
    var i = 0;
    while (i <= days) {
      if (i === 0) {
        finalArray.push({ x: newDate, y: runningTotal });
      }
      if (i % 30 === 0) {
        finalArray.push({ x: newDate, y: runningTotal });
      }
      runningTotal += runningTotal * rate;
      newDate = newDate + 86400000;

      i++;
    }
    return finalArray;
  };

  const data = {
    //labels: ["02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00", "00:00"],
    datasets: [
      {
        label: false,
        pointRadius: 0,
        data: getDataTraditional(0.000219178, props.years, props.amount),
        /*data: [
                    {x: '2021-08-08T13:12:23', y: 3},
                    {x: '2021-08-08T13:12:45', y: 5},
                    {x: '2021-08-08T13:12:46', y: 6},
                    {x: '2021-08-08T13:13:11', y: 3},
                    {x: '2021-08-08T13:14:23', y: 9},
                    {x: '2021-08-08T13:16:45', y: 1}
                ],*/
        //data: this.props.data.map(({ anc_price }) =>
        //  big(anc_price).toNumber(),
        // ),
        tension: 0.5,
        borderColor: 'rgb(0,0,0,)',
        borderWidth: 2,
      },
      {
        label: false,
        pointRadius: 0,
        data: getData(props.rate, props.years, props.amount),
        /*data: [
                    {x: '2021-08-08T13:12:23', y: 3},
                    {x: '2021-08-08T13:12:45', y: 5},
                    {x: '2021-08-08T13:12:46', y: 6},
                    {x: '2021-08-08T13:13:11', y: 3},
                    {x: '2021-08-08T13:14:23', y: 9},
                    {x: '2021-08-08T13:16:45', y: 1}
                ],*/
        //data: this.props.data.map(({ anc_price }) =>
        //  big(anc_price).toNumber(),
        // ),
        tension: 0.5,
        borderColor: 'rgb(251, 216, 93)',
        borderWidth: 2,
        fill: { target: 'origin', above: getGradient() },
      },
    ],
  };
  return (
    <Container className="new-chart-earnings">
      {
        //@ts-ignore
        <Line
          data={data}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
              //@ts-ignore
              tooltip: {
                enabled: false,

                external: ({ chart, tooltip }) => {
                  let element = tooltipRef.current!;

                  if (tooltip.opacity === 0) {
                    element.style.opacity = '0';
                    return;
                  }

                  const div1 = document.getElementById('div3');
                  const hr = document.getElementById('hr3');

                  if (div1) {
                    try {
                      const i = tooltip.dataPoints[0].dataIndex;
                      const isLast = i === data.datasets[0].data.length - 1;
                      const item = data.datasets[0].data[i];
                      const deposits = item.y;
                      const borrows = item.y;
                      const date = new Date(item.x);

                      div1.innerHTML = `
                    <span>$ ${numberWithCommas(deposits.toFixed(2))} UST ${date
                        .toString()
                        .slice(0, 10)}
                    </span>`;
                    } catch {}
                  }

                  if (hr) {
                    hr.style.top = chart.scales.y.paddingTop + 'px';
                    hr.style.height = chart.scales.y.height + 'px';
                  }

                  element.style.opacity = '1';
                  element.style.transform = `translateX(${tooltip.caretX}px)`;
                },
              },

              legend: { display: false },
            },
              interaction: {
          intersect: false,
          mode: 'index',
        },
            scales: {
              x: {
                min: data.datasets[0].data[0].x,

                max: data.datasets[0].data.pop().x,
                offset: false,
                type: 'time',
                time: {
                  unit: 'month',
                },
                ticks: {
                  display: false,
                },
                grid: {
                  display: false,
                },
              },

              y: {
                beginAtZero: false,
                ticks: {
                  display: false,
                },
                grid: {
                  display: false,
                  drawBorder: false,
                },
              },

              //@ts-ignore
              xAxes: [
                {
                  adapters: {
                    date: {
                      locale: de,
                    },
                  },

                  type: 'time',
                  time: {
                    min: data.datasets[0].data[0].x,

                    max: data.datasets[0].data.pop().x,
                  },
                },
              ],
            },
          }}
          height={343}
          width={'inherit'}
          style={{ maxWidth: 'inherit' }}
        />
      }
      <ChartTooltip ref={tooltipRef} id="tt">
        <hr id="hr3" />
        <section
          id="div3"
          style={{
            backgroundColor: '#493C3C',
            padding: '5px 7px 5px 7px',
            fontSize: '10px',
            borderRadius: '20px',
            fontWeight:'400'
          }}
        ></section>
      </ChartTooltip>
    </Container>
  );
};
