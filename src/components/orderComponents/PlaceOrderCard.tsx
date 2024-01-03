import { Fragment, useEffect, useState } from "react";
import {
  ArrowSmallLeftIcon,
  ArrowSmallRightIcon,
  ArrowsPointingOutIcon,
  CheckIcon,
  ChevronDownIcon,
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

const tabs = [
  { name: "Trade", href: "#", current: false, lineColor: "#BF71DF" },
  { name: "Earn", href: "#", current: false, lineColor: "#E86B3A" },
  { name: "Mint", href: "#", current: false, lineColor: "#0EE29B" },
];
const chains = [
  { name: "INJ", icon: "./logo_injective.svg" },
  { name: "ATOM", icon: "./logo_atom.svg" },
  { name: "OSMO", icon: "./logo_osmo.svg" },
  { name: "stETH", icon: "./logo_stEth.svg" },
  { name: "USDT", icon: "./logo_usdt.svg" },
  { name: "wMATIC", icon: "./logo_matic.svg" },
];
const units = ['PT', 'YT', 'RT'];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const PlaceOrderCard = ({ handleClick, yieldGraphOpen, setLineColor }) => {
  const [collateral, setCollateral] = useState("Select Asset");
  const [quantity, setQuantity] = useState("10");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [duration, setDuration] = useState("10");
  const [priceSell, setPriceSell] = useState("10");
  const [priceBuy, setPriceBuy] = useState("10");
  const [selectedUnit, setSelectedUnit] = useState(units[0]); // State for selected unit
  const [currentMode, setCurrentMode] = useState("Trade");
  const [collateralLevel, setCollateralLevel] = useState(220);
  const [selectedChain, setSelectedChain] = useState(chains[0]);
  const [selectedChainCollateral, setSelectedChainCollateral] = useState(
    chains[0]
  );

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

  async function placeTradeOrder(quantity, duration, chain, collateral) {

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

  async function placeEarnOrder(quantity, duration, chain) {
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

  function placeMintOrder(quantity, duration, chain) {
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

  return (
    <div className="bg-neutral-900/50 backdrop-blur-[4px] py-4 xl:py-6 rounded-xl w-full flex flex-col xl:justify-between h-full min-h-[600px] ">
      <div>
        {" "}
        <div className="flex items-center justify-between mb-2 xl:mb-4 px-4 xl:px-6">
          <span className="text-[16px] xl:text-lg font-bold text-[#f2f2f2] uppercase">
            Place Order
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

        <div className="flex flex-col items-center w-full px-6 2xl:px-16">

          <Listbox
            value={selectedChain}
            onChange={setSelectedChain}
            className="mt-2 xl:mt-4"
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
          <span className="text-gray-400 mx-0 mb-6 text-xs">[Underlying APY 4.05%]</span>

        </div>

        {/* CMNTS: END The Chain selector in the order card */}

        {/* CMNTS: The order form */}

        <div className={`flex items-center space-x-4 w-full px-6 2xl:px-16 ${currentMode !== "Trade" ? "mb-4" : ""}`}>
        </div>

        {/* CMNTS: The order form only for Trade mode */}

        {currentMode == "Trade" && (
          <div className=" px-6 2xl:px-16 ">

            <div className="w-full pb-5">
              <label htmlFor="price-buy" className="block text-sm xl:text-sm font-medium leading-6 text-gray-100">
                Buy
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="flex items-center rounded-md border-2 border-temporal50 bg-neutral-950/50">
                  <input
                    type="text"
                    name="price-buy"
                    id="price-buy"
                    className="flex-grow border-0 rounded-l-md py-3 xl:py-4 pl-7 text-white bg-transparent focus:outline-none"
                    placeholder="0.00"
                    aria-describedby="price-addon apy-addon"
                    value={priceBuy}
                    onChange={(e) => setPriceBuy(e.target.value)}
                  />
                  <div className="flex items-center">
                    <Listbox value={selectedUnit} onChange={setSelectedUnit}>
                      <Listbox.Button className="cursor-default text-[#f2f2f2] py-2 px-3 text-left flex items-center">
                        {selectedUnit}
                        <ChevronDownIcon
                          className="ml-2 h-4 w-4 text-gray-400"
                          aria-hidden="true"
                        />
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute border border-temporal px-2 py-1 mt-1 overflow-auto text-base bg-neutral-950 rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                          {units.map((unit, unitIdx) => (
                            <Listbox.Option
                              key={unitIdx}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-4 pr-4 ${active ? "bg-gray-700 text-white" : "text-white"}`
                              }
                              value={unit}
                            >
                              <span className={`block truncate ${selectedUnit === unit ? 'font-medium' : 'font-normal'}`}>
                                {unit}
                              </span>
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </Listbox>
                    <div className="flex flex-col items-end pr-3">
                      <span className="text-gray-500 text-xs" id="price-addon">Px 0.0001</span>
                      <span className="text-gray-500 text-xs" id="apy-addon">APY 12.08%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full pb-5">
              <label htmlFor="price-sell" className="block text-sm xl:text-sm font-medium leading-6 text-gray-100">
                Sell
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="flex items-center rounded-md border-2 border-temporal50 bg-neutral-950/50">
                  <input
                    type="text"
                    name="price-sell"
                    id="price-sell"
                    className="flex-grow border-0 rounded-l-md py-3 xl:py-4 pl-7 text-white bg-transparent focus:outline-none"
                    placeholder="0.00"
                    aria-describedby="price-addon apy-addon"
                    value={priceSell}
                    onChange={(e) => setPriceSell(e.target.value)}
                  />
                  <div className="flex items-center">
                    <Listbox value={selectedUnit} onChange={setSelectedUnit}>
                      <Listbox.Button className="cursor-default text-[#f2f2f2] py-2 px-3 text-left flex items-center">
                        {selectedUnit}
                        <ChevronDownIcon
                          className="ml-2 h-4 w-4 text-gray-400"
                          aria-hidden="true"
                        />
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute border border-temporal px-2 py-1 mt-1 overflow-auto text-base bg-neutral-950 rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                          {units.map((unit, unitIdx) => (
                            <Listbox.Option
                              key={unitIdx}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-4 pr-4 ${active ? "bg-gray-700 text-white" : "text-white"}`
                              }
                              value={unit}
                            >
                              <span className={`block truncate ${selectedUnit === unit ? 'font-medium' : 'font-normal'}`}>
                                {unit}
                              </span>
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </Listbox>
                    <div className="flex flex-col items-end pr-3">
                      <span className="text-gray-500 text-xs" id="price-addon">Px 0.999</span>
                      <span className="text-gray-500 text-xs" id="apy-addon">APY 4.03%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full pb-5">
              <label
                htmlFor="time"
                className="block text-sm xl:text-sm font-medium leading-6 text-gray-100"
              >
                Duration
              </label>
              <div className="relative mt-1 xl:mt-2 rounded-md shadow-sm">
                <input
                  type="text"
                  name="time"
                  id="time"
                  className="block w-full rounded-md border-0 py-3 xl:py-4 pl-7 pr-12 text-[#f2f2f2] ring-1 ring-inset ring-temporal50 placeholder:text-gray-100 focus:ring-temporal50 bg-neutral-950/50  "
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

        {/* <div className="mb-4 bg-[#036B681A] border border-temporal50 py-2 px-4 mx-6 2xl:mx-16 rounded-[3px]">
          <div className="text-[#f2f2f2] text-xs xl:text-sm">
            Estimated Yield:
          </div>
          <div className="text-temporal text-md xl:text-xl">
            {collateralLevel}%
          </div>
        </div> */}
      </div>
      <button
        className="w-[350px] mx-auto mt-5 py-2 text-gray-300 rounded-md shadow-md border-1 border-temporal"
        style={{
          backgroundImage: 'linear-gradient(to right, #004C4C80, #005B5B , #002C3C)'
        }} onClick={() => {
          switch (currentMode) {
            case "Trade":
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
      >
        TRADE
      </button>

      {/* CMNTS: END The order form */}

    </div>
  );
};

export default PlaceOrderCard;
