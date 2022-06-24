import { useState, useEffect } from 'react';
import {
  AnchorTax,
  AnchorTokenBalances,
  DefaultAnchorTokenBalances,
} from '@anchor-protocol/app-fns';
import {
  useCW20Balance,
  useTerraNativeBalances,
  useUstTax,
} from '@libs/app-provider';
import { useMemo , useState} from 'react';
import {
  MsgExecuteContract,
  WasmAPI,
  Coin,
  LCDClient,
  Fee,
} from '@terra-money/terra.js';
import axios from 'axios';
import { successOption, errorOption, POOL, farmInfo } from '../../../constants';
import { useAccount } from '../../../contexts/account';

export interface AnchorBank {
  tax: AnchorTax;
  tokenBalances: AnchorTokenBalances;
  farmInfo:
    | {
        amountHistory: any;
        aprUstHistory: any;
        aprLunaHistory: any;
        ustInfo: any;
        lunaInfo: any;
        userInfoUst: any;
        userInfoLuna: any;
        farmPrice: any;
        farmInfo: any;
        farmStartTime: any;
        ust_total_rewards: any;
        luna_total_rewards: any;
        status: any;
      }
    | Promise<any>;
}

export function useTheFarm(): any {
  const lcd = new LCDClient({
    //
    URL: 'https://bombay-lcd.terra.dev',
    chainID: 'Bombay-12',
    gasPrices: { uusd: 0.45 },
  });

  const api = new WasmAPI(lcd.apiRequester);

  const wallet = useAccount();
  const { terraWalletAddress } = useAccount();
  const [result2, setResult2] = useState<any>(
    {
     farm: {
      amount: "0",
      wallet: "abcdefg"
      },
      pot: {
        luna_amount: "0",
        qualified_luna_amount: "0",
        qualified_ust_amount: "0",
        ust_amount: "0",
        wallet:"abcdefg",
      }
    }
  );
  useEffect(() => {
    if (wallet) {
      try {
      api.contractQuery(POOL, {
          get_status: { wallet: wallet?.nativeWalletAddress },
    }).then((value)=>{return setResult2(value)});
      
      } catch (e) {
        console.log(e);
      }
    }
  }, [wallet]);

  if (result2.pot_info) {
    console.log(result2)
    return {pot: result2.pot_info, farm: {user:result2.farm_info, price_info: result2.farm_price, start: result2.farm_starttime}};
  }
  return  {
      pot: {
        luna_amount: "0",
        qualified_luna_amount: "0",
        qualified_ust_amount: "0",
        ust_amount: "0",
        wallet:"abcdefg",
      },
     farm: {
      user: { amount: "1",
        wallet: "abcdefg"
      },
      price_info: "1",
      start: "1"
      },
      
    }
}

export function useTheTVL(): any {
  const lcd = new LCDClient({
    //
    URL: 'https://bombay-lcd.terra.dev',
    chainID: 'Bombay-12',
    gasPrices: { uusd: 0.45 },
  });

  const api = new WasmAPI(lcd.apiRequester);

  const wallet = useAccount();
  const { terraWalletAddress } = useAccount();
  const [result1, setResult1] = useState([
    {
    
      luna_amount: "78283638",
      luna_reward: "17547378",
      time: 1651672201,
      ust_amount: "1420615982",
      ust_reward: "6051635",

      }]
  );
  useEffect(() => {
    try {
       api.contractQuery(POOL, {
        get_amount_history: {},
      }).then((value)=>{return setResult1(value)});
    } catch (e) {}
  }, []);

  if (result1) {
    console.log(result1)
    return result1;
  }
}

export function useDeposits(): any {
  const lcd = new LCDClient({
    //
    URL: 'https://bombay-lcd.terra.dev',
    chainID: 'Bombay-12',
    gasPrices: { uusd: 0.45 },
  });

  const api = new WasmAPI(lcd.apiRequester);

  const wallet = useAccount();
  const { terraWalletAddress } = useAccount();
  const [result1, setResult1] = useState({
    amount: '0',
    deposit_time: '0',
    reward_amount: '0',
    wallet: '0',
  });
  const [result2, setResult2] = useState({
    amount: '0',
    deposit_time: '0',
    reward_amount: '0',
    wallet: '0',
  });
  useEffect(() => {
    try {
      api
        .contractQuery(
          POOL,
          {
            get_user_info_ust: {
              wallet: wallet?.nativeWalletAddress,
            },
          },
          //@ts-ignore
        )
        .then((value) => {
          console.log('REQUESTEDDDDD))))))))))))))))))))))))');

          return setResult1(value);
        });
    } catch (e) {}

    if (wallet) {
      try {
        api
          .contractQuery(
            POOL,
            {
              get_user_info_luna: {
                wallet: wallet?.nativeWalletAddress,
              },
            },
            //@ts-ignore
          )
          .then((value) => {
            return setResult2(value);
          });
      } catch (e) {}
    }
  }, [wallet]);

  if (result1 && result2) {
    return { luna: result2, ust: result1};
  }
}

export function useAnchorBank(): AnchorBank {
  const wallet = useAccount();
  const { terraWalletAddress } = useAccount();

  async function fetchData() {
    const lcd = new LCDClient({
      //
      URL: 'https://bombay-lcd.terra.dev',
      chainID: 'Bombay-12',
      gasPrices: { uusd: 0.45 },
    });

    const api = new WasmAPI(lcd.apiRequester);

    let amountHistory = undefined,
      aprUstHistory = undefined,
      aprLunaHistory = undefined,
      ustInfo = undefined,
      lunaInfo = undefined,
      userInfoUst = undefined,
      userInfoLuna = undefined,
      farmPrice = undefined,
      farmInfo = undefined,
      farmStartTime = undefined,
      ust_total_rewards = undefined,
      luna_total_rewards = undefined,
      status: any = undefined;

    try {
      lunaInfo = await axios.get(
        `https://api.extraterrestrial.money/v1/api/prices?symbol=LUNA`,
      );
    } catch (e) {}

    try {
      ustInfo = await axios.get(
        `https://api.extraterrestrial.money/v1/api/prices?symbol=UST`,
      );
    } catch (e) {}

    if (wallet) {
      try {
        status = await api.contractQuery(POOL, {
          get_status: { wallet: wallet?.nativeWalletAddress },
        });
        console.log(status)
      } catch (e) {
        console.log(e);
      }
    }
    console.log(status);
    try {
      amountHistory = await api.contractQuery(POOL, {
        get_amount_history: {},
      });
    } catch (e) {}

    try {
      aprUstHistory = await api.contractQuery(POOL, {
        get_history_of_apr_ust: {},
      });
    } catch (e) {}

    try {
      aprLunaHistory = await api.contractQuery(POOL, {
        get_history_of_apr_luna: {},
      });
    } catch (e) {}

    try {
      userInfoUst = await api.contractQuery(POOL, {
        get_user_info_ust: {
          wallet: wallet?.nativeWalletAddress,
        },
      });
    } catch (e) {}

    if (wallet) {
      try {
        userInfoLuna = await api.contractQuery(POOL, {
          get_user_info_luna: {
            wallet: wallet?.nativeWalletAddress,
          },
        });
      } catch (e) {}
    }
    try {
      farmPrice = await api.contractQuery(POOL, {
        get_farm_price: {},
      });
    } catch (e) {}

    try {
      farmInfo = await api.contractQuery(POOL, {
        get_farm_info: {
          wallet: wallet?.nativeWalletAddress,
        },
      });
    } catch (e) {}

    try {
      farmStartTime = await api.contractQuery(POOL, {
        get_farm_starttime: {},
      });
    } catch (e) {}

    const farm = {
      status: status ? status : 0,
      amountHistory,
      aprUstHistory,
      aprLunaHistory,
      ustInfo,
      lunaInfo,
      userInfoLuna,
      userInfoUst,
      farmPrice,
      farmInfo,
      farmStartTime,
      ust_total_rewards,
      luna_total_rewards,
    };
    if (
      amountHistory &&
      aprLunaHistory &&
      aprUstHistory &&
      userInfoLuna &&
      userInfoUst &&
      farmInfo
    ) {
      return farm;
    }
  }
  let farming;
  if (wallet.connected) {
    farming = fetchData();
  }
  const { taxRate, maxTax } = useUstTax();

  const { uUST, uLuna } = useTerraNativeBalances(terraWalletAddress);

  return {
    tax: {
      taxRate,
      maxTaxUUSD: maxTax,
    },
    tokenBalances: {
      ...DefaultAnchorTokenBalances,
      uUST,
      uLuna,
    },
    farmInfo: farming,
  };
}
