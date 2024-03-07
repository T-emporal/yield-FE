import { Fragment, useEffect, useState, useRef } from "react";
import {
  ArrowSmallLeftIcon,
  ArrowSmallRightIcon,
  ArrowsPointingOutIcon,
  ArrowDownCircleIcon,
  CheckIcon,
  ClockIcon,
  ChevronDownIcon,
  ArrowPathRoundedSquareIcon,
  ArrowPathIcon,
  WindowIcon,
} from "@heroicons/react/24/outline";
import { Listbox, Transition } from "@headlessui/react";
import { getOraclePrice } from "@/layouts/DashboardLayout";

import {
  ChainGrpcWasmApi,
  MsgExecuteContractCompat,
  MsgExecuteContract,
  MsgSend,
  PrivateKey,
  getInjectiveAddress,
  InjectiveStargate,
} from "@injectivelabs/sdk-ts";
import { INJ_DENOM } from "@injectivelabs/sdk-ui-ts";
import { Network, getNetworkEndpoints } from '@injectivelabs/networks';
import { ChainId } from "@injectivelabs/ts-types";

import { BigNumberInBase } from "@injectivelabs/utils";
import { useRouter } from 'next/router';
import Image from 'next/image';
import Xarrow from "react-xarrows";

import { Wallet, WalletStrategy, MsgBroadcaster } from '@injectivelabs/wallet-ts'
import {
  Web3Exception,
  WalletException,
  UnspecifiedErrorCode,
  ErrorType
} from '@injectivelabs/exceptions'

import { GraphData, PlaceOrderCardProps } from '@/types/Components';

import { Window as KeplrWindow } from "@keplr-wallet/types";
declare global {
  interface Window extends KeplrWindow { }
}
const tabs = [
  { name: "Trade", href: "#", current: false, lineColor: "#BF71DF" },
  { name: "Mint", href: "#", current: false, lineColor: "#0EE29B" },
  { name: "Earn", href: "#", current: false, lineColor: "#E86B3A" },
];
// const chains = [
//   { name: "stINJ", icon: "./logo_injective.svg", apy: "4.05%" },
//   { name: "stATOM", icon: "./logo_atom.svg", apy: "3.05%" },
//   { name: "stOSMO", icon: "./logo_osmo.svg", apy: "4.34%" },
//   { name: "stETH", icon: "./logo_stEth.svg", apy: "2.77%" },
//   { name: "stUSDT", icon: "./logo_usdt.svg", apy: "4.05%" },
//   { name: "stMATIC", icon: "./logo_matic.svg", apy: "4.05%" },
// ];
const chains = [
  { name: "stINJ", icon: "./logo_injective.svg"},
  { name: "stATOM", icon: "./logo_atom.svg"},
  { name: "stOSMO", icon: "./logo_osmo.svg"},
  { name: "stETH", icon: "./logo_stEth.svg"},
  { name: "stUSDT", icon: "./logo_usdt.svg"},
  { name: "stMATIC", icon: "./logo_matic.svg"},
];
const units = ['PT', 'YT', 'RT'];
const poolSummaryData = [
  ['', 'Units', 'Value'],
  ['Total', '', '$2.0M'],
  ['PT', '600k', '$700k'],
  ['Asset', '1.32M', '$1.3M'],
];
// const durationOptions = [
//   { id: 1, name: '1 day' },
//   { id: 2, name: '7 days' },
//   { id: 3, name: '30 days' },
//   { id: 4, name: '60 days' },
//   { id: 5, name: '90 days' },
// ];

type IncomingDataItem = {
  [key: string]: string; // The key is dynamic but always a string, mapping to a string value
};

type IncomingData = {
  data: IncomingDataItem[];
  status: boolean;
};

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}
const PlaceOrderCard = ({ handleClick, yieldGraphOpen, setLineColor, setGraphData }: PlaceOrderCardProps) => {
  const [collateral, setCollateral] = useState("Select Asset");
  const [durationOptions, setDurationOptions] = useState([
    { id: 1, name: '1 day' },
    { id: 2, name: '7 days' },
    { id: 3, name: '30 days' },
    { id: 4, name: '60 days' },
    { id: 5, name: '90 days' },
  ]);

  const [structuredData, setStructuredData] = useState({});


  const [quantity, setQuantity] = useState("10");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [duration, setDuration] = useState("");
  const [selectedTradeDuration, setSelectedTradeDuration] = useState(durationOptions[2]);
  const [priceSell, setPriceSell] = useState("10");
  const [priceBuy, setPriceBuy] = useState("10");
  const [mintAmount, setMintAmount] = useState('');
  const [selectedUnit, setSelectedUnit] = useState(units[0]);
  const [poolValue, setPoolValue] = useState('');
  const [currentMode, setCurrentMode] = useState("Trade");
  const [collateralLevel, setCollateralLevel] = useState(220);
  const [selectedChain, setSelectedChain] = useState(chains[0]);
  const [mintMode, setMintMode] = useState('mint');

  const [selectedMintChain, setSelectedMintChain] = useState(chains[0]);
  const [selectedMintDuration, setselectedMintDuration] = useState(durationOptions[0]);
  const [mintDuration, setMintDuration] = useState('');

  const [RedeemAmount, setRedeemAmount] = useState('');

  const [PTTradeValue, setPTTradeValue] = useState('');
  const [PTTradeValueFinal, setPTTradeValueFinal] = useState('');
  const [PTData, setPTData] = useState({ PTpx: 0.0001, PTapy: 12.08 });
  const [YTTradeValue, setYTTradeValue] = useState('');
  const [YTTradeValueFinal, setYTTradeValueFinal] = useState('');
  const [YTData, setYTData] = useState({ YTpx: 0.999, YTapy: 4.03 });

  const [isPTActive, setIsPTActive] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const [tradeApy, setTradeApy] = useState(4.15);

  const router = useRouter();
  useEffect(() => {
    const { token, tab } = router.query;

    const matchingChain = chains.find(chain => chain.name === token);

    if (tab === 'mint' && matchingChain) {
      setCurrentMode('Mint');
      setSelectedMintChain(matchingChain);
    } else if (tab === 'trade' && matchingChain) {
      setCurrentMode('Trade');
      setSelectedChain(matchingChain);
    }
  }, [router.query]);

  const switchValues = () => {
    setIsAnimating(true);

    const newPTTradeValue = YTTradeValue;
    const newYTTradeValue = PTTradeValue;
    setPTTradeValue(newPTTradeValue);
    setYTTradeValue(newYTTradeValue);

    setIsPTActive(!isPTActive);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500); // Assuming your animation takes 1 second
  };

  const updateDurationOptions = (labels: number[]) => {
    const newDurationOptions = labels.map((label, index) => ({
      id: index + 1,
      name: `${label} days`
    }));

    setDurationOptions(newDurationOptions);
  };
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8080/graph');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result: IncomingData = await response.json();
      console.log(result);
      
      let yieldData: number[] = [];
      let principalData: number[] = [];
      let labels: number[] = [];

      result.data.forEach((item: IncomingDataItem) => {
        const key = Object.keys(item)[0];
        const value = item[key];
        const [yieldStr, principalStr] = value.split(', ').map(s => s.split(': ')[1]);
        labels.push(parseInt(key));
        yieldData.push(parseFloat(yieldStr));
        principalData.push(parseFloat(principalStr));
      });

      const structuredData: GraphData = {
        yieldData,
        principalData,
        labels
      };
      setStructuredData(structuredData);
      setGraphData(structuredData)
      updateDurationOptions(labels);
      // setselectedMintDuration(durationOptions[0])
      console.log("Fetching data for graph...");

    } catch (error) {
      console.error("There was a problem with fetching the data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [])

  useEffect(() => {
    console.log("Fetching PT and YT data...");

    const fetchPTandYTData = async () => {
      try {
        const durationNumber = selectedTradeDuration.name.split(' ')[0];
  
        const response = await fetch(`http://localhost:8080/node/PTandYTByDuration/${durationNumber}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        if (data.status) {
          setPTData({ PTpx: data.PT_Px, PTapy: data.PT_APY });
          setYTData({ YTpx: data.YT_Px, YTapy: data.YT_APY });
          setTradeApy(parseFloat(data.UnderlyingYield.replace('%', '')));
        }
      } catch (error) {
        console.error("There was a problem with fetching PT and YT data: ", error);
      }
    };
  
    fetchPTandYTData();
  }, [selectedTradeDuration]);
  
  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setPTTradeValueFinal(PTTradeValue);
      console.log("Final PT Trade Value is", PTTradeValue);
    }, 800);

    return () => clearTimeout(delayInputTimeoutId);
  }, [PTTradeValue]);

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setYTTradeValueFinal(YTTradeValue);
      console.log("Final YT Trade Value is", YTTradeValue);
    }, 800);

    return () => clearTimeout(delayInputTimeoutId);
  }, [YTTradeValue]);

  
  useEffect(() => {
    const updateTradeValues = async () => {
      if (isPTActive && PTTradeValueFinal) {
        try {
          const durationNumber = selectedTradeDuration.name.split(' ')[0];

          const response = await fetch(`http://localhost:8080/node/YTForPTByDuration/${durationNumber}/${PTTradeValueFinal}`);
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          setYTTradeValue(data.YT);
        } catch (error) {
          console.error("There was a problem with fetching YT data based on PT value: ", error);
        }
      } else if (!isPTActive && YTTradeValueFinal) {
        try {
          const durationNumber = selectedTradeDuration.name.split(' ')[0];

          const response = await fetch(`http://localhost:8080/node/PTForYTByDuration/${durationNumber}/${YTTradeValueFinal}`);
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          setPTTradeValue(data.PT);
        } catch (error) {
          console.error("There was a problem with fetching PT data based on YT value: ", error);
        }
      }
    };

    updateTradeValues();
  }, [isPTActive ? PTTradeValueFinal : YTTradeValueFinal, selectedTradeDuration]);


  // ---------------------------CONTRACT_CONNECT-------------------------------------
  // async function getBalance() {
  //   if (!window.keplr) {
  //     alert("POC Please install keplr extension");
  //   } else {
  //     await window.keplr.enable(ChainId.Testnet);
  //     const offlineSigner = window.keplr.getOfflineSigner(ChainId.Testnet);
  //     const [account] = await offlineSigner.getAccounts();

  //     const endpoints = getNetworkEndpoints(Network.TestnetSentry).rpc ?? "https://testnet.sentry.tm.injective.network:443";

  //     try {
  //       const client =
  //         await InjectiveStargate.InjectiveSigningStargateClient.connectWithSigner(
  //           endpoints,
  //           offlineSigner
  //         );
  //       const balances = await client.getAllBalances(account.address);
  //       console.log("Balances", balances);
  //       if (balances.length !== 0) {
  //         return balances[3].amount;
  //       }
  //       else {
  //         return 0;
  //       }
  //     } catch (error) {
  //       console.log(error)
  //     }

  //   }
  // }
  // ---------------------------CONTRACT_CONNECT-------------------------------------
  // ---------------------------CONTRACT_CONNECT-------------------------------------
  // async function placeTradeOrder(
  //   quantity: string,
  //   duration: string,
  //   chain: string,
  //   collateral: number
  // ) {

  //   console.log({ quantity, duration, chain, collateral });

  //   const contractAddress = "inj19q99j99ddvw8sksza6hrz7l08xv94f9e7j9jlp"; //Get Contract Address

  //   const NETWORK = Network.TestnetSentry
  //   const ENDPOINTS = getNetworkEndpoints(NETWORK)
  //   const chainGrpcWasmApi = new ChainGrpcWasmApi(ENDPOINTS.grpc)

  //   const walletStrategy = new WalletStrategy({
  //     chainId: ChainId.Testnet,
  //   })

  //   const getAddresses = async (): Promise<string[]> => {
  //     const addresses = await walletStrategy.getAddresses();

  //     if (addresses.length === 0) {
  //       throw new Web3Exception(
  //         new Error("There are no addresses linked in this wallet.")
  //       );
  //     }

  //     return addresses;
  //   };


  //   const msgBroadcastClient = new MsgBroadcaster({
  //     walletStrategy,
  //     network: NETWORK,
  //   })

  //   console.log(msgBroadcastClient)

  //   const [address] = await getAddresses();
  //   const injectiveAddress = address
  //   console.log(injectiveAddress)

  //   const msg = MsgExecuteContractCompat.fromJSON({
  //     contractAddress,
  //     sender: injectiveAddress,
  //     exec: {
  //       action: "borrow_from_pool",
  //       msg: [
  //         {
  //           denom: INJ_DENOM,
  //           amount: new BigNumberInBase(quantity).toWei().toFixed(),
  //           duration: duration,
  //           quantity: quantity,
  //           collateral: { denom: INJ_DENOM, amount: new BigNumberInBase(collateral).toWei().toFixed(), }, //To Check 
  //         },
  //       ],
  //     },
  //   });

  //   console.log(msg)

  //   try {
  //     const txHash = await msgBroadcastClient.broadcast({
  //       msgs: msg,
  //       injectiveAddress: injectiveAddress,
  //     });

  //     console.log(txHash);
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //   }

  //   // function placeTradeOrder(quantity, duration, chain, collateral) {
  //   //   console.log({ quantity, duration, chain, collateral });

  //   return { quantity, duration, chain, collateral };
  // }
  // ---------------------------CONTRACT_CONNECT-------------------------------------


  async function placeTradeOrder(
    YTTradeValue: string,
    PTTradeValue: string,
    duration: string,
    chain: string,
  ) {

    console.log({ YTTradeValue, PTTradeValue, duration, chain });

    const Order = {
      Type: isPTActive ? "PT" : "YT",
      Unit: parseFloat(isPTActive ? PTTradeValue : YTTradeValue),
      Duration: parseInt(selectedTradeDuration.name.split(' ')[0], 10), // Assuming the format "XX days"
    };

    console.log(Order);
    try {
      const response = await fetch('http://localhost:8080/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Order),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('API call was successful, data:', data);

      fetchData();
    } catch (error) {
      console.error('There was a problem with the API call:', error);
    }


    return { YTTradeValue, PTTradeValue, duration, chain };
  }

  async function placeEarnOrder(
    quantity: string,
    duration: string,
    chain: string,
  ) {
    console.log({ quantity, duration, chain });

    const contractAddress = "inj10k852590ktkn5k9jw5gjgktmleawqdaes63qda";

    const NETWORK = Network.TestnetSentry
    const ENDPOINTS = getNetworkEndpoints(NETWORK)
    const chainGrpcWasmApi = new ChainGrpcWasmApi(ENDPOINTS.grpc)

    const walletStrategy = new WalletStrategy({
      chainId: ChainId.Testnet,
    })

    const getAddresses = async (): Promise<string[]> => {
      const addresses = await walletStrategy.getAddresses();

      if (addresses.length === 0) {
        throw new Web3Exception(
          new Error("There are no addresses linked in this wallet.")
        );
      }

      return addresses;
    };

    const msgBroadcastClient = new MsgBroadcaster({
      walletStrategy,
      network: NETWORK,
    })

    console.log(msgBroadcastClient)

    const [address] = await getAddresses();
    const injectiveAddress = address
    console.log(injectiveAddress)

    // ================================================
    // Old implementation with msg    
    // ================================================

    // const innerMsg = {
    //   "Escrow": {
    //     "time": parseInt(duration),
    //   }
    // };

    // const innerMsg = {
    //   "time": parseInt(duration),
    // };

    // let jsonString = JSON.stringify(innerMsg);

    // const msg = MsgExecuteContract.fromJSON({
    //   contractAddress,
    //   sender: injectiveAddress,
    //   exec: {
    //     action: "lend_to_pool",
    //     msg: {
    //       sender: injectiveAddress,
    //       amount: parseInt(baseAmount),
    //       msg: jsonString,
    //     },
    //   },
    // });
    // ================================================


    const msg = MsgExecuteContract.fromJSON({
      contractAddress,
      sender: injectiveAddress,
      msg: {
        lend_to_pool_v2: {
          lender: injectiveAddress,
          amount: new BigNumberInBase(quantity).toWei().toFixed(),
          duration: parseInt(duration)
        },
      },
    });

    try {
      const txHash = await msgBroadcastClient.broadcast({
        msgs: msg,
        injectiveAddress: injectiveAddress,
      });

      console.log(txHash);
    } catch (error) {
      console.error("An error occurred:", error);
    }

    return { quantity, duration, chain };
  }

  function placeMintOrder(
    quantity: string,
    duration: string,
    chain: string,
  ) {
    console.log({ quantity, duration, chain });
    return { quantity, duration, chain };
  }
  useEffect(() => {
    async function x() {
      let price = await getOraclePrice(selectedChain.name);
      setCurrentPrice(+price * +quantity);
    }
    x();
  }, [quantity, selectedChain]);
  useEffect(() => {
    setQuantity("10");
    setCurrentPrice(0);
  }, [currentMode]);

  // ---------------------------CONTRACT_CONNECT-------------------------------------
  // useEffect(() => {
  //   async function y() {
  //     let balance = await getBalance();
  //     if (balance !== undefined) {
  //       setCurrentBalance(Number(balance) / 1e+18);
  //     } else {
  //       setCurrentBalance(0);
  //     }
  //   }
  //   y();
  // }, [mintMode]);
  // ---------------------------CONTRACT_CONNECT-------------------------------------

  const renderMintView = () => (
    <>

      <div className="flex items-center">
        <div className="relative w-full mt-2 pb-0">
          {/* <div className="w-full flex justify-between items-center pb-2">
            <label htmlFor="mint-amount" className="text-sm xl:text-sm font-medium leading-6 text-gray-100">
              Input
            </label>
            <label className="text-sm xl:text-sm font-medium leading-6 text-gray-100">
              Balance: {currentBalance}
            </label>
          </div> */}

          <div id="mint-input-box" className="rounded-md border-2 border-temporal50 bg-neutral-950/50 mt-2  flex">
            <div className="relative pr-6 flex-1 border-r border-temporal50">
              <Listbox value={selectedMintChain} onChange={setSelectedMintChain}>
                <Listbox.Button className="cursor-default text-gray-400 py-4 px-3 text-left w-full flex items-center">
                  <span className=" truncate flex items-center text-gray-400">
                    <Image src={selectedMintChain.icon} alt={selectedMintChain.name} width={25} height={25} className="mr-5" />
                    {selectedMintChain.name}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  enter="transition transform origin-top duration-200 ease-out"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition transform origin-top duration-200 ease-in"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Listbox.Options className="absolute mt-1 w-full  bg-[#15191D] rounded-md shadow-lg z-1000">
                    {chains.map((chain) => (
                      <Listbox.Option key={chain.name} value={chain} as={Fragment}>
                        {({ active, selected }) => (
                          <li className={`${active ? "bg-gray-700 text-[#f2f2f2]" : "text-[#f2f2f2]"} flex items-center px-4 py-2 cursor-pointer`}>
                            <Image src={chain.icon} alt={chain.name} width={40} height={40} className="px-3" />
                            {chain.name}
                          </li>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </Listbox>
            </div>
            <input
              type="number"
              name="mint-amount"
              id="mint-amount"
              className="flex-1 border-0 border-l text-center border-temporal50 py-4 text-white bg-transparent focus:outline-none "
              placeholder="Enter amount"
              aria-describedby="mint-amount"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Xarrow
        start="mint-input-box"
        startAnchor={"bottom"}
        end="mint-duration-box"
        endAnchor={"top"}
        showHead={false}
        color={"#00A9A433"}
        strokeWidth={2}
        curveness={0.3}
      />

      {/* Duration information */}
      <div className="flex justify-center my-14">
        <div id="mint-duration-box" className="flex items-center bg-neutral-950/50 py-2 rounded-full border-2 border-temporal50 text-gray-400">
          <div className="pl-3">
            <ClockIcon className="h-8 w-8 mr-4 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="number"
            value={mintDuration}
            onChange={(e) => setMintDuration(e.target.value)}
            className="focus:outline-none py-2 w-24 border-0 text-gray-400 bg-transparent"
            placeholder="Duration"
          />
          <span className="px-3 py-2 text-gray-400">Days</span>
        </div>
      </div>

      <Xarrow
        start="mint-duration-box"
        startAnchor={"left"}
        end="mint-output-box-1"
        endAnchor={"top"}
        color={"#00A9A433"}
        strokeWidth={2}
        path="grid"
        curveness={1}
        zIndex={-10}
      />
      <Xarrow
        start="mint-duration-box"
        startAnchor={"right"}
        end="mint-output-box-2"
        endAnchor={"top"}
        color={"#00A9A433"}
        strokeWidth={2}
        path="grid"
        curveness={1}
        zIndex={-10}
      />

      {/* Outputs */}
      <div className="flex justify-around items-center flex-wrap space-x-4">

        {/* <div id="mint-output-box-1" className="flex-1 min-w-[48%] flex flex-col items-center rounded-md border-2 border-temporal50 bg-neutral-900/40 mt-4 mr-2"> */}
        <div id="mint-output-box-1" className="flex-1 min-w-[48%] flex flex-col items-center rounded-md border-2 border-temporal50 bg-teal-950/30 ">
          <div className="w-full flex justify-center items-center py-4">
            <Image src={selectedMintChain.icon} alt={selectedMintChain.name} width={25} height={25} />
            <div className="text-gray-400 text-center ml-4">PT {selectedMintChain.name}</div>
          </div>
          <div className="w-full border-temporal50"></div>
          {/* <div className="w-full border-t-2 border-temporal50"></div> */}
          <span className="py-4 text-center text-gray-400 bg-transparent">
            {mintAmount || '0'}
          </span>
        </div>

        {/* <div id="mint-output-box-2" className="flex-1 min-w-[48%] flex flex-col items-center rounded-md border-2 border-temporal50 bg-neutral-900/40 mt-4 ml-2"> */}
        <div id="mint-output-box-2" className="flex-1 min-w-[48%] flex flex-col items-center rounded-md border-2 border-temporal50 bg-teal-950/30">
          <div className="w-full flex justify-center items-center py-4">
            <Image src={selectedMintChain.icon} alt={selectedMintChain.name} width={25} height={25} />
            <div className="text-gray-400 text-center ml-4">YT {selectedMintChain.name}</div>
          </div>
          <div className="w-full border-temporal50"></div>
          {/* <div className="w-full border-t-2 border-temporal50"></div> */}
          <span className="py-4 text-center text-gray-400 bg-transparent">
            {mintAmount || '0'}
          </span>
        </div>
      </div>
    </>
  );

  const renderRedeemView = () => (
    <>
      {/* <div className="w-full flex justify-between items-center">
        <label htmlFor="mint-amount" className="text-sm xl:text-sm font-medium leading-6 text-gray-100">
          Input
        </label>
        <label className="text-sm xl:text-sm font-medium leading-6 text-gray-100">
          Balance: {currentBalance}
        </label>
      </div> */}
      <div className="flex items-center justify-between w-full space-x-4">
        {/* PT Input Box */}
        <div id="redeem-input-box-1" className="flex-1 min-w-[48%] flex flex-col items-center rounded-md border-2 border-temporal50 bg-neutral-950/50 mt-4">
          <Listbox value={selectedMintChain} onChange={setSelectedMintChain}>
            <Listbox.Button className="cursor-default text-gray-400 py-4 px-3 text-left w-full flex items-center rounded-md  ">
              <span className="truncate flex items-center text-gray-400">
                <Image src={selectedMintChain.icon} alt={selectedMintChain.name} width={25} height={25} className=" mr-3" />
                {'PT ' + selectedMintChain.name}
              </span>
              <ChevronDownIcon className="ml-auto h-5 w-5 text-gray-400" aria-hidden="true" />
            </Listbox.Button>
            <Transition
              as={Fragment}
              enter="transition transform origin-top duration-200 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition transform origin-top duration-200 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Listbox.Options className="absolute mt-1 w-1/2 bg-[#15191D] rounded-md shadow-lg max-h-60 py-1 z-10">
                {chains.map((chain) => (
                  <Listbox.Option key={chain.name} value={chain} as={Fragment}>
                    {({ active }) => (
                      <li className={`${active ? "bg-gray-700 text-[#f2f2f2]" : "text-[#f2f2f2]"} flex items-center px-4 py-2 cursor-pointer`}>
                        <Image src={chain.icon} alt={chain.name} width={25} height={25} className="mr-3" />
                        {'PT ' + chain.name}
                      </li>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </Listbox>
          <div className="w-full border-t-2 border-temporal50"></div>
          <input
            type="number"
            className="w-full py-4 px-3 text-center border-none text-white bg-transparent focus:outline-none"
            placeholder="PT Amount"
            value={RedeemAmount}
            onChange={(e) => setRedeemAmount(e.target.value)}
          />
        </div>

        {/* YT Input Box */}
        <div id="redeem-input-box-2" className="flex-1 min-w-[48%] flex flex-col items-center rounded-md border-2 border-temporal50 bg-teal-950/30 mt-4">
          <div className="w-full flex flex-1  justify-center  border-temporal50 items-center py-4">
            {/* <div className="w-full flex flex-1  justify-center border-r-2 border-temporal50 items-center py-4"> */}
            <Image src={selectedMintChain.icon} alt={selectedMintChain.name} width={25} height={25} />
            <div className="text-gray-400 text-center ml-4">YT {selectedMintChain.name}</div>
          </div>
          <span className="flex-1 py-4 text-center text-gray-400 bg-transparent">
            {RedeemAmount || 0}
          </span>
        </div>
      </div>

      <Xarrow
        start="redeem-input-box-1"
        startAnchor={"bottom"}
        end="redeem-duration-box"
        endAnchor={"left"}
        showHead={false}
        color={"#00A9A433"}
        strokeWidth={2}
        curveness={0}
        path="grid"
      />
      <Xarrow
        start="redeem-input-box-2"
        startAnchor={"bottom"}
        end="redeem-duration-box"
        endAnchor={"right"}
        showHead={false}
        color={"#00A9A433"}
        strokeWidth={2}
        curveness={0}
        path="grid"

      />

      {/* Duration information */}

      <div className="flex justify-center my-14">
        <div id="redeem-duration-box" className="flex items-center bg-neutral-950/50  rounded-full border-2 border-temporal50 text-gray-400">
          <div className="pl-3">
            <ClockIcon className="h-8 w-8 ml-2 mr-4 text-gray-400" aria-hidden="true" />
          </div>
          <Listbox value={selectedMintDuration} onChange={setselectedMintDuration}>
            <Listbox.Button className=" text-gray-400 py-4 px-6 flex items-center relative">
              <span className="block truncate">{selectedMintDuration.name}</span>
              <ChevronDownIcon className="ml-4 h-5 w-5" aria-hidden="true" />
            </Listbox.Button>
            <Transition
              as={Fragment}
              enter="transition transform origin-top duration-200 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition transform origin-top duration-200 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Listbox.Options className="absolute mt-1 bg-[#15191D] rounded-md shadow-lg max-h-60 py-1 z-5" style={{ width: 'auto' }}>
                {durationOptions.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    className={({ active }) =>
                      `${active ? 'bg-gray-700 text-[#f2f2f2]' : 'text-[#f2f2f2]'} cursor-pointer select-none relative py-2 pl-10 pr-4`
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {option.name}
                        </span>
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </Listbox>
        </div>
      </div>

      <Xarrow
        start="redeem-duration-box"
        startAnchor={"bottom"}
        end="redeem-output-box"
        endAnchor={"top"}
        color={"#00A9A433"}
        strokeWidth={2}
        curveness={0.2}
        zIndex={-10}
      />

      {/* Output Section */}
      <div className="flex justify-around items-center flex-wrap">

        <div id="redeem-output-box" className="flex-1 min-w-[48%] flex  items-center rounded-md border-2 border-temporal50 bg-teal-950/30  ">
          <div className="w-full flex flex-1  justify-center  border-temporal50 items-center py-4">
            {/* <div className="w-full flex flex-1  justify-center border-r-2 border-temporal50 items-center py-4"> */}
            <Image src={selectedMintChain.icon} alt={selectedMintChain.name} width={25} height={25} />
            <div className="text-gray-400 text-center ml-4">{selectedMintChain.name}</div>
          </div>
          <span className="flex-1 py-4 text-center text-gray-400 bg-transparent">
            {RedeemAmount || 0}
          </span>
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-gray-700/20 backdrop-blur-[4px] py-4 xl:py-6 rounded-xl w-full flex flex-col xl:justify-between h-full min-h-[600px] ">
      <div>
        {" "}
        <div className="flex items-center justify-between mb-2 xl:mb-4 px-4 xl:px-6">
          <span className="text-[16px] xl:text-lg font-bold text-[#f2f2f2] uppercase">
            Transact
          </span>
          <span
            className="-rotate-45 flex items-center cursor-pointer"
            onClick={handleClick}
          >
            {!yieldGraphOpen ? (
              <ArrowsPointingOutIcon
                strokeWidth={1.5}
                className="w-5 h-5 text-[#f2f2f2] rotate-45"
              />
            ) : (
              <>
                <ArrowSmallRightIcon
                  strokeWidth={3}
                  className="w-3 h-3 text-[#f2f2f2]"
                />
                <ArrowSmallLeftIcon
                  strokeWidth={3}
                  className="w-3 h-3 text-[#f2f2f2]"
                />
              </>
            )}
          </span>
        </div>

        {/* CMNTS: Tabs for the order card */}

        {/* <div className="border-b-[0.5px] border-gray-700">
          <nav
            className=" grid grid-cols-3 justify-items-center"
            aria-label="Tabs"
          >
            {tabs.map((tab) => (
              <span
                key={tab.name}
                onClick={() => {
                  setCurrentMode(tab.name);
                  setLineColor(tab.lineColor);
                }}
                className={classNames(
                  tab.name == currentMode
                    ? "border-temporal text-temporal"
                    : "border-transparent text-[#f2f2f2] hover:border-gray-300 ",
                  "whitespace-nowrap border-b-2 py-2 px-1 text-sm xl:text-[16px] block w-full text-center font-normal uppercase cursor-pointer"
                )}
                aria-current={tab.current ? "page" : undefined}
              >
                {tab.name}
              </span>
            ))}
          </nav>
        </div> */}
        <div className="border-b-[0.5px] border-gray-700">
          <nav
            className="grid grid-cols-3 justify-items-center"
            aria-label="Tabs"
          >
            {tabs.map((tab) => {
              const displayName = tab.name === "Earn" ? "Earn (TBD)" : tab.name;

              return (
                <span
                  key={tab.name}
                  onClick={() => {
                    // Prevent setting the current mode and line color if the tab is "Earn"
                    if (tab.name !== "Earn") {
                      setCurrentMode(tab.name);
                      setLineColor(tab.lineColor);
                    }
                  }}
                  className={classNames(
                    tab.name == currentMode
                      ? "border-temporal text-temporal"
                      : "border-transparent text-[#f2f2f2] hover:border-gray-300",
                    "whitespace-nowrap border-b-2 py-2 px-1 text-sm xl:text-[16px] block w-full text-center font-normal uppercase",
                    // Use "cursor-default" for "Earn" to indicate it's not clickable
                    tab.name === "Earn" ? "cursor-default" : "cursor-pointer"
                  )}
                  aria-current={tab.current ? "page" : undefined}
                >
                  {displayName}
                </span>
              );
            })}
          </nav>
        </div>

        {/* CMNTS: END Tabs for the order card */}

        {/* CMNTS: The Chain selector in the order card */}

        {currentMode !== "Mint" && (
          <div className="flex flex-col items-center w-full px-6 2xl:px-16">

            <Listbox
              value={selectedChain}
              onChange={setSelectedChain}
            >
              <div className="relative mt-4">
                <Listbox.Button className="relative w-[150px] left-[50%] -translate-x-[50%] cursor-default rounded-lg  py-2 pl-3 pr-10 text-left  ">
                  <span className=" truncate flex items-center text-[#f2f2f2]">
                    <Image
                      alt={selectedChain.name}
                      src={selectedChain.icon}
                      width={25}
                      height={25}
                      className="mr-2"
                    />{" "}
                    {selectedChain.name}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  enter="transition transform origin-top duration-200 ease-out"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition transform origin-top duration-200 ease-in"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Listbox.Options className="absolute border border-temporal mt-1 max-h-60 w-[150px]  left-[50%] -translate-x-[50%] overflow-auto rounded-md  py-1 text-base  ring-1 ring-black ring-opacity-5  bg-[#15191D] z-[999]">
                    {chains.map((chain, chainIdx) => (
                      <Listbox.Option
                        key={chainIdx}
                        className={({ active }) =>
                          `relative text-[#f2f2f2] cursor-default select-none py-2  px-4 ${active ? "bg-gray-700 text-[#f2f2f2]" : "text-[#f2f2f2]"
                          }`
                        }
                        value={chain}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`flex items-center truncate ${selectedChain ? "font-medium" : "font-normal"
                                }`}
                            >
                              <Image
                                alt={chain.name}
                                src={chain.icon}
                                width={25}
                                height={25}
                                className="mr-2"
                              />{" "}
                              {chain.name}
                              {chain.name == selectedChain.name && (
                                <span className="block w-2 h-2 rounded-full ml-2 bg-green-500"></span>
                              )}
                            </span>
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
            <span className="text-gray-400 mx-0 mb-6 text-xs">[Underlying APY {tradeApy}%]</span>

          </div>

        )}

        {/* CMNTS: END The Chain selector in the order card */}



        {/* CMNTS: The order form */}

        {/* CMNTS: The order form only for Trade mode */}

        {currentMode == "Trade" && (
          <div className=" px-6 2xl:px-16 ">

            <div className="w-full pb-5 ">
              <label htmlFor="price-top" className="block text-sm xl:text-sm font-medium leading-6 text-gray-100">
                Sell
              </label>
              <div className="relative mt-2 xl:mt-3 rounded-md shadow-sm">
                <div className="flex items-center rounded-md border-2 border-temporal50 bg-neutral-950/50 mt-2">
                  <span className={`px-5 ${isPTActive ? 'text-blue-500' : 'text-orange-500'}`}>{isPTActive ? 'PT' : 'YT'}</span>
                  <input
                    type="number"
                    name="price-top"
                    id="price-top"
                    className="flex-grow border-0 rounded-md py-3 xl:py-4 pl-7 text-white bg-transparent focus:outline-none"
                    placeholder="0.00"
                    aria-describedby="price-addon apy-addon"
                    value={isPTActive ? PTTradeValue : YTTradeValue}
                    onChange={(e) => isPTActive ? setPTTradeValue(e.target.value) : setYTTradeValue(e.target.value)}
                  />
                  <div className="flex flex-col items-end px-5">
                    <span className="text-gray-500 text-xs" id="price-addon">
                      Px {isPTActive ? PTData.PTpx.toFixed(5) : YTData.YTpx.toFixed(5)}
                    </span>
                    <span className="text-gray-500 text-xs" id="apy-addon">
                      APY {isPTActive ? PTData.PTapy.toFixed(2) : YTData.YTapy.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center">
              <button onClick={switchValues} className="...">
                <ArrowPathIcon
                  className={`h-6 w-6 text-gray-400 ${isAnimating ? 'animate-rotation' : ''}`}
                  aria-hidden="true"
                />
              </button>
            </div>


            <div className="w-full pb-5 ">
              <label htmlFor="price-bottom" className="block text-sm xl:text-sm font-medium leading-6 text-gray-100">
                Buy
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                {/* <div className="flex items-center rounded-md border-2 border-temporal50 bg-neutral-950/50 mt-2"> */}
                <div className="flex items-center rounded-md border-2 border-temporal50 bg-teal-950/50 mt-2">
                  <span className={`px-5 ${isPTActive ? 'text-orange-500' : 'text-blue-500'}`}>{isPTActive ? 'YT' : 'PT'}</span>
                  <input
                    type="number"
                    name="price-bottom"
                    id="price-bottom"
                    className="flex-grow  border-0 rounded-md py-3 xl:py-4 pl-7 text-white bg-transparent focus:outline-none"
                    disabled
                    placeholder="0.00"
                    aria-describedby="price-addon apy-addon"
                    value={isPTActive ? YTTradeValue : PTTradeValue}
                    onChange={(e) => isPTActive ? setYTTradeValue(e.target.value) : setPTTradeValue(e.target.value)}
                  />
                  <div className="flex flex-col items-end px-5">
                  <span className="text-gray-500 text-xs" id="price-addon">
                      Px {isPTActive ? YTData.YTpx.toFixed(5) : PTData.PTpx.toFixed(5)}
                    </span>
                    <span className="text-gray-500 text-xs" id="apy-addon">
                      APY {isPTActive ? YTData.YTapy.toFixed(2) : PTData.PTapy.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full pb-5">
              <label
                htmlFor="time"
                className="block mt-2 text-sm xl:text-sm font-medium leading-6 text-gray-100"
              >
                Duration
              </label>
              <div className="relative rounded-md border-2 border-temporal50 bg-neutral-950/50 mt-3">

                {/* <input
                  type="number"
                  name="time"
                  id="time"
                  className="block w-full border-0 rounded-md py-3 xl:py-4 pl-7 text-white bg-transparent focus:outline-none"
                  placeholder="0.00"
                  aria-describedby="time-duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 sm:text-sm" id="price-currency">
                    Days
                  </span>
                </div> */}
                <Listbox value={selectedTradeDuration} onChange={setSelectedTradeDuration}>
                  {({ open }) => (
                    <>
                      <Listbox.Button className="flex justify-between items-center relative w-full border-0 rounded-md py-3 xl:py-4 px-7 text-white bg-transparent focus:outline-none">
                        <span className="block truncate">{selectedTradeDuration.name}</span>
                        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <Listbox.Options className="absolute w-full mt-1 bg-[#15191D] rounded-md shadow-lg max-h-60 py-1 z-10 overflow-auto">
                          {durationOptions.map((option) => (
                            <Listbox.Option
                              key={option.id}
                              className={({ active }) =>
                                `${active ? 'bg-gray-700 text-[#f2f2f2]' : 'text-[#f2f2f2]'} cursor-pointer select-none relative py-2 pl-10 pr-4`
                              }
                              value={option}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                    {option.name}
                                  </span>
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </>
                  )}
                </Listbox>
              </div>
            </div>
            {/* Duration information */}

          </div>
        )}
        {/* CMNTS: END The order form only for Trade mode */}


        {/* CMNTS: The order form only for Earn mode */}

        {currentMode == "Earn" && (
          <div className=" px-6 2xl:px-16 pb-5">

            <div className="text-white rounded-lg w-full" >
              <h2 className="text-xl mb-4">Pool Summary</h2>
              <div className="bg-neutral-950/50 border-2 border-temporal50 rounded-lg p-2">
                <table className="w-full text-gray-300 text-left">
                  <tbody>
                    {poolSummaryData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-2">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-md border-2 border-temporal50 bg-teal-950/50 text-white p-2 mt-10 flex justify-between items-center">
              <label className="p-1 mr-2">LP</label>
              <input
                type="number"
                placeholder="Enter value"
                value={poolValue}
                onChange={(e) => setPoolValue(e.target.value)}
                className="flex-grow border-0 rounded-md py-2 xl:py-2 pl-7 text-white text-center bg-neutral-950/50 focus:outline-none cursor-not-allowed"
                disabled
              />
              <div className="flex pl-5 justify-center items-center">
                <div className="flex flex-col items-center pr-3">
                  <span className="text-gray-500 text-xs" id="price-addon">Est. APY</span>
                  <span className="text-gray-500 text-xs" id="apy-addon">15.07%</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* CMNTS: END The order form only for Earn mode */}

        {/* CMNTS: The order form only for Mint mode */}

        {currentMode == "Mint" && (
          <div className=" px-6 2xl:px-16 pb-5 ">
            <div className="flex my-5 justify-center text-sm bg-transparent rounded-lg">
              <button
                onClick={() => setMintMode('mint')}
                className={`w-24 border border-r-0 border-temporal px-4 py-2 rounded-l-lg transition duration-500 ease-in-out ${mintMode === 'mint' ? 'bg-temporal50 text-white' : 'bg-teal-900/30 text-gray-400'}`}
              >
                MINT
              </button>
              <button
                onClick={() => setMintMode('redeem')}
                className={`w-24 border border-l-0 border-temporal px-4 py-2 rounded-r-lg transition duration-500 ease-in-out ${mintMode === 'redeem' ? 'bg-temporal50 text-white' : 'bg-teal-900/30 text-gray-400'}`}
              >
                REDEEM
              </button>
            </div>
            <div className="mt-4">
              {mintMode === 'mint' ? renderMintView() : renderRedeemView()}
            </div>

          </div>
        )}

        {/* CMNTS: END The order form only for Mint mode */}

      </div>
      <button
        // className="w-[350px] mx-auto mt-5 py-2 text-gray-300 rounded-md shadow-md border-1 border-temporal "
        className={`button w-[350px] mx-auto mt-5 py-2 text-gray-300 rounded-md shadow-md border-1 border-temporal ${currentMode === "Earn" ? "cursor-not-allowed" : ""}`}

        onClick={() => {
          switch (currentMode) {
            case "Trade":
              return placeTradeOrder(
                YTTradeValue,
                PTTradeValue,
                selectedTradeDuration.name,
                selectedChain.name,
              );
            case "Earn":
              return placeEarnOrder(quantity, duration, selectedChain.name);
            case "Mint":
              return placeMintOrder(quantity, selectedMintDuration.name, selectedChain.name);
            default:
              break;
          }
        }}
        disabled={currentMode === "Earn"}
      >
        <span className={`button-text ${currentMode === "Earn" ? "text-gray-500" : "text-gray-300"} z-10`}>
          {currentMode === 'Mint' ? mintMode.toUpperCase() : currentMode.toUpperCase()}
        </span>
      </button>

      {/* CMNTS: END The order form */}

    </div>


  );
};

export default PlaceOrderCard;
