import { Fragment, useEffect, useState } from "react";
import {
  ArrowSmallLeftIcon,
  ArrowSmallRightIcon,
  ArrowsPointingOutIcon,
  ArrowDownCircleIcon,
  CheckIcon,
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
import { useSearchParams } from "next/navigation";

import { Wallet, WalletStrategy, MsgBroadcaster } from '@injectivelabs/wallet-ts'
import {
  Web3Exception,
  WalletException,
  UnspecifiedErrorCode,
  ErrorType
} from '@injectivelabs/exceptions'

import { PlaceOrderCardProps } from '@/types/Components';

import { Window as KeplrWindow } from "@keplr-wallet/types";
declare global {
  interface Window extends KeplrWindow { }
}
const tabs = [
  { name: "Trade", href: "#", current: false, lineColor: "#BF71DF" },
  { name: "Mint", href: "#", current: false, lineColor: "#0EE29B" },
  { name: "Earn", href: "#", current: false, lineColor: "#E86B3A" },
];
const chains = [
  { name: "stINJ", icon: "./logo_injective.svg", apy: "4.05%" },
  { name: "stATOM", icon: "./logo_atom.svg", apy: "3.05%" },
  { name: "stOSMO", icon: "./logo_osmo.svg", apy: "4.34%" },
  { name: "stETH", icon: "./logo_stEth.svg", apy: "2.77%" },
  { name: "stUSDT", icon: "./logo_usdt.svg", apy: "4.05%" },
  { name: "stMATIC", icon: "./logo_matic.svg", apy: "4.05%" },
];
const units = ['PT', 'YT', 'RT'];
const poolSummaryData = [
  ['', 'Units', 'Value'],
  ['Total', '', '$2.0M'],
  ['PT', '600k', '$700k'],
  ['Asset', '1.32M', '$1.3M'],
];


function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}
const PlaceOrderCard = ({ handleClick, yieldGraphOpen, setLineColor }: PlaceOrderCardProps) => {
  const [collateral, setCollateral] = useState("Select Asset");
  const [quantity, setQuantity] = useState("10");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [duration, setDuration] = useState("");
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

  const [PTValue, setPTValue] = useState('');
  const [YTValue, setYTValue] = useState('');
  const [isPTActive, setIsPTActive] = useState(true); // State to track which input is active
  const [isAnimating, setIsAnimating] = useState(false);

  const switchValues = () => {
    setIsAnimating(true);

    const newPTValue = YTValue;
    const newYTValue = PTValue;
    setPTValue(newPTValue);
    setYTValue(newYTValue);

    setIsPTActive(!isPTActive);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500); // Assuming your animation takes 1 second
  };

  // console.log("params", );

  // function placeTradeOrder(quantity, duration, chain, collateral) {
  //   let { privateKey, mnemonic } = PrivateKey.generate();
  //   const msg = MsgExecuteContractCompat.fromJSON({
  //     contractAddress,
  //     sender: injectiveAddress,
  //     exec: {
  //       action: "Trade",
  //       funds: [
  //         {
  //           denom: INJ_DENOM,
  //           amount: new BigNumberInBase(quantity).toWei().toFixed(),
  //           duration: duration,
  //           quantity: quantity,
  //           collateral: {
  //             denom: INJ_DENOM,
  //             amount: new BigNumberInBase(collateral).toWei().toFixed(),
  //           }, //To Check
  //         },
  //       ],
  //     },
  //   });
  //   console.log("privateKey", privateKey, mnemonic);
  //   const txHash = new MsgBroadcasterWithPk({
  //     privateKey, //Get this private key from wallet
  //     network: Network.Testnet,
  //   }).broadcast({
  //     msgs: msg,
  //   });

  //   console.log(txHash);
  //   console.log({ quantity, duration, chain, collateral });
  //   return { quantity, duration, chain, collateral };
  // }
  async function getBalance() {
    if (!window.keplr) {
      alert("POC Please install keplr extension");
    } else {
      await window.keplr.enable(ChainId.Testnet);
      const offlineSigner = window.keplr.getOfflineSigner(ChainId.Testnet);
      const [account] = await offlineSigner.getAccounts();

      const endpoints = getNetworkEndpoints(Network.TestnetSentry).rpc ?? "https://testnet.sentry.tm.injective.network:443";

      try {
        const client =
          await InjectiveStargate.InjectiveSigningStargateClient.connectWithSigner(
            endpoints,
            offlineSigner
          );
        const balances = await client.getAllBalances(account.address);
        console.log("Balances", balances);
        if (balances.length !== 0) {
          return balances[3].amount;
        }
        else {
          return 0;
        }
      } catch (error) {
        console.log(error)
      }

    }
  }

  async function placeTradeOrder(
    quantity: string,
    duration: string,
    chain: string,
    collateral: number
  ) {

    console.log({ quantity, duration, chain, collateral });

    const contractAddress = "inj19q99j99ddvw8sksza6hrz7l08xv94f9e7j9jlp"; //Get Contract Address

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

    const msg = MsgExecuteContractCompat.fromJSON({
      contractAddress,
      sender: injectiveAddress,
      exec: {
        action: "borrow_from_pool",
        msg: [
          {
            denom: INJ_DENOM,
            amount: new BigNumberInBase(quantity).toWei().toFixed(),
            duration: duration,
            quantity: quantity,
            collateral: { denom: INJ_DENOM, amount: new BigNumberInBase(collateral).toWei().toFixed(), }, //To Check 
          },
        ],
      },
    });

    console.log(msg)

    try {
      const txHash = await msgBroadcastClient.broadcast({
        msgs: msg,
        injectiveAddress: injectiveAddress,
      });

      console.log(txHash);
    } catch (error) {
      console.error("An error occurred:", error);
    }

    // function placeTradeOrder(quantity, duration, chain, collateral) {
    //   console.log({ quantity, duration, chain, collateral });

    return { quantity, duration, chain, collateral };
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
  useEffect(() => {
    async function y() {
      let balance = await getBalance();
      if (balance !== undefined) {
        setCurrentBalance(Number(balance));
      } else {
        setCurrentBalance(0);
      }
    }
    y();
  }, [mintMode]);


  const renderMintView = () => (
    <>
      <div className="flex items-center">
        <div className="w-full pb-5">
          <div className="w-full flex justify-between items-center">
            <label htmlFor="mint-amount" className="text-sm xl:text-sm font-medium leading-6 text-gray-100">
              Input
            </label>
            <label className="text-sm xl:text-sm font-medium leading-6 text-gray-100">
              Balance: {currentBalance}
            </label>
          </div>

          <div className="rounded-md border-2 border-temporal50 bg-neutral-950/50 mt-2  flex">
            <div className="relative pr-5 flex-1 border-r border-temporal50">
              <Listbox value={selectedMintChain} onChange={setSelectedMintChain}>
                <Listbox.Button className="cursor-default text-gray-400 py-4 px-3 text-left w-full flex items-center">
                  <span className=" truncate flex items-center text-gray-400">
                    <img src={selectedMintChain.icon} alt={selectedMintChain.name} className="w-6 mr-5 h-6" />
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
                  <Listbox.Options className="absolute mt-1 w-full  bg-[#15191D] rounded-md shadow-lg z-100">
                    {chains.map((chain) => (
                      <Listbox.Option key={chain.name} value={chain} as={Fragment}>
                        {({ active, selected }) => (
                          <li className={`${active ? "bg-gray-700 text-[#f2f2f2]" : "text-[#f2f2f2]"} flex items-center px-4 py-2 cursor-pointer`}>
                            <img src={chain.icon} alt={chain.name} className="w-10 h-10 px-3" />
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
              type="text"
              name="mint-amount"
              id="mint-amount"
              className="flex-1 border-0 border-l border-temporal50 py-4 text-white bg-transparent focus:outline-none "
              placeholder=""
              aria-describedby="mint-amount"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
            />
          </div>
        </div>
      </div>



      <div className="flex justify-center">
        <ArrowDownCircleIcon
          strokeWidth={2}
          className="w-7 h-7 text-temporal50"
        />
      </div>

      {/* Outputs based on the input, for now, they are static */}
      <div className="flex flex-col">
        <div className="flex items-center rounded-md border-2 border-temporal50 bg-neutral-950/50 mt-4">
          <div className="flex-1 flex items-center border-r-2 border-temporal50 py-2 ">
            <img src={selectedMintChain.icon} alt={selectedMintChain.name} className="w-6 mx-5 h-6 " />
            <div>
              <div className="text-gray-400">PT {selectedMintChain.name}</div>
              <div className="text-gray-400 text-xs">30 Dec 2030</div>
            </div>
          </div>
          <span className="flex-1 py-4 text-center text-gray-400 bg-transparent">
            0
          </span>
        </div>

        <div className="flex items-center rounded-md border-2 border-temporal50 bg-neutral-950/50 mt-4">
          <div className="flex-1 flex items-center border-r-2 border-temporal50 py-2 ">
            <img src={selectedMintChain.icon} alt={selectedMintChain.name} className="w-6 mx-5 h-6 " />
            <div>
              <div className="text-gray-400">YT {selectedMintChain.name}</div>
              <div className="text-gray-400 text-xs">30 Dec 2030</div>
            </div>
          </div>
          <span className="flex-1 py-4 text-center text-gray-400 bg-transparent">
            0
          </span>
        </div>
      </div>
    </>
  );

  const renderRedeemView = () => (
    <>
      <div className="flex items-center">
        <div className="w-full pb-5">
          <label htmlFor="mint-amount" className="text-xs xl:text-sm font-medium leading-6 text-gray-100">
            Tip: Before maturity, both PT and YT are required for redemption. After maturity, only PT is required.
          </label>
          <div className="w-full flex justify-between items-center mt-5">
            <label htmlFor="mint-amount" className="text-sm xl:text-sm font-medium leading-6 text-gray-100">
              Input
            </label>
            <label className="text-sm xl:text-sm font-medium leading-6 text-gray-100">
              Balance: {currentBalance}
            </label>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center rounded-md border-2 border-temporal50 bg-neutral-950/50 mt-1">
              <div className="flex-1 flex items-center border-r-2 border-temporal50 py-2 ">
                <img src={selectedMintChain.icon} alt={selectedMintChain.name} className="w-6 mx-5 h-6 " />
                <div>
                  <div className="text-gray-400">PT {selectedMintChain.name}</div>
                  <div className="text-gray-400 text-xs">30 Dec 2030</div>
                </div>
              </div>
              <span className="flex-1 py-4 text-center text-gray-400 bg-transparent">
                0
              </span>
            </div>


            <div className="w-full flex justify-between items-center mt-5">
              <label htmlFor="mint-amount" className="text-sm xl:text-sm font-medium leading-6 text-gray-100">

              </label>
              <label className="text-sm xl:text-sm font-medium leading-6 text-gray-100">
                Balance: {currentBalance}
              </label>
            </div>


            <div className="flex items-center rounded-md border-2 border-temporal50 bg-neutral-950/50 mt-1">
              <div className="flex-1 flex items-center border-r-2 border-temporal50 py-2 ">
                <img src={selectedMintChain.icon} alt={selectedMintChain.name} className="w-6 mx-5 h-6 " />
                <div>
                  <div className="text-gray-400">YT {selectedMintChain.name}</div>
                  <div className="text-gray-400 text-xs">30 Dec 2030</div>
                </div>
              </div>
              <span className="flex-1 py-4 text-center text-gray-400 bg-transparent">
                0
              </span>
            </div>
          </div>

        </div>
      </div>



      <div className="flex justify-center">
        <ArrowDownCircleIcon
          strokeWidth={2}
          className="w-7 h-7 text-temporal50"
        />
      </div>

      <div className="rounded-md border-2 border-temporal50 bg-neutral-950/50 mt-5  flex">
        <div className="relative pr-5 flex-1 border-r border-temporal50">
          <Listbox value={selectedMintChain} onChange={setSelectedMintChain}>
            <Listbox.Button className="cursor-default text-gray-400 py-4 px-3 text-left w-full flex items-center">
              <span className=" truncate flex items-center text-gray-400">
                <img src={selectedMintChain.icon} alt={selectedMintChain.name} className="w-6 mr-5 h-6" />
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
              <Listbox.Options className="absolute mt-1 w-full  bg-[#15191D] rounded-md shadow-lg z-100">
                {chains.map((chain) => (
                  <Listbox.Option key={chain.name} value={chain} as={Fragment}>
                    {({ active, selected }) => (
                      <li className={`${active ? "bg-gray-700 text-[#f2f2f2]" : "text-[#f2f2f2]"} flex items-center px-4 py-2 cursor-pointer`}>
                        <img src={chain.icon} alt={chain.name} className="w-10 h-10 px-3" />
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
          type="text"
          name="mint-amount"
          id="mint-amount"
          className="flex-1 border-0 border-l border-temporal50 py-4 text-white bg-transparent focus:outline-none "
          placeholder=""
          aria-describedby="mint-amount"
          value={mintAmount}
          onChange={(e) => setMintAmount(e.target.value)}
        />
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

        <div className="border-b-[0.5px] border-gray-700">
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
                    <img
                      alt={selectedChain.name}
                      src={selectedChain.icon}
                      className="w-5 mr-2"
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
                              <img
                                alt={chain.name}
                                src={chain.icon}
                                className="w-5 mr-2"
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
            <span className="text-gray-400 mx-0 mb-6 text-xs">[Underlying APY {selectedChain.apy}]</span>

          </div>

        )}



        {/* CMNTS: END The Chain selector in the order card */}

        {/* CMNTS: The order form */}

        {/* <div className={`flex items-center space-x-4 w-full px-6 2xl:px-16 ${currentMode !== "Trade" ? "mb-4" : ""}`}>
        </div> */}

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
                    type="text"
                    name="price-top"
                    id="price-top"
                    className="flex-grow border-0 rounded-md py-3 xl:py-4 pl-7 text-white bg-transparent focus:outline-none"
                    placeholder="0.00"
                    aria-describedby="price-addon apy-addon"
                    value={isPTActive ? PTValue : YTValue}
                    onChange={(e) => isPTActive ? setPTValue(e.target.value) : setYTValue(e.target.value)}
                  />
                  <div className="flex flex-col items-end pr-3">
                    <span className="text-gray-500 text-xs" id="price-addon">{isPTActive ? 'Px 0.0001' : 'Px 0.999'}</span>
                    <span className="text-gray-500 text-xs" id="apy-addon">{isPTActive ? 'APY 12.08%' : 'APY 4.03%'}</span>
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
                <div className="flex items-center rounded-md border-2 border-temporal50 bg-neutral-950/50 mt-2">
                  <span className={`px-5 ${isPTActive ? 'text-orange-500' : 'text-blue-500'}`}>{isPTActive ? 'YT' : 'PT'}</span>
                  <input
                    type="text"
                    name="price-bottom"
                    id="price-bottom"
                    className="flex-grow border-0 rounded-md py-3 xl:py-4 pl-7 text-white bg-transparent focus:outline-none"
                    placeholder="0.00"
                    aria-describedby="price-addon apy-addon"
                    value={isPTActive ? YTValue : PTValue}
                    onChange={(e) => isPTActive ? setYTValue(e.target.value) : setPTValue(e.target.value)}
                  />
                  <div className="flex flex-col items-end pr-3">
                    <span className="text-gray-500 text-xs" id="price-addon">{isPTActive ? 'Px 0.999' : 'Px 0.0001'}</span>
                    <span className="text-gray-500 text-xs" id="apy-addon">{isPTActive ? 'APY 4.03%' : 'APY 12.08%'}</span>
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
                <input
                  type="text"
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
                </div>
              </div>
            </div>

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

            <div className="rounded-md border-2 border-temporal50 bg-teal-950/50 text-white p-2 mt-4 flex justify-between items-center">
              <label className="p-1 mr-2">LP</label>
              <input
                type="text"
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
        className={`w-[350px] mx-auto mt-5 py-2 text-gray-300 rounded-md shadow-md border-1 border-temporal ${currentMode === "Earn" ? "cursor-not-allowed" : ""}`}

        style={{
          backgroundImage: 'linear-gradient(to right, #004C4C80, #005B5B , #002C3C)'
        }} onClick={() => {
          switch (currentMode) {
            case "Trade":
              console.log("YT Value: " + YTValue + " PT Value: " + PTValue)

              return placeTradeOrder(
                quantity,
                duration,
                selectedChain.name,
                collateralLevel
              );
            case "Earn":
              return placeEarnOrder(quantity, duration, selectedChain.name);
            case "Mint":
              return placeMintOrder(quantity, duration, selectedChain.name);
            default:
              break;
          }
        }}
        disabled={currentMode === "Earn"}
      >
        {currentMode.toUpperCase()}
      </button>

      {/* CMNTS: END The order form */}

    </div>
  );
};

export default PlaceOrderCard;
