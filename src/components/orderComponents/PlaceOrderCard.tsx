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
  PrivateKey,
  getInjectiveAddress 
} from "@injectivelabs/sdk-ts";
import { INJ_DENOM } from "@injectivelabs/sdk-ui-ts";
import { Network, getNetworkEndpoints } from '@injectivelabs/networks';
import { ChainId } from "@injectivelabs/ts-types";

import { BigNumberInBase } from "@injectivelabs/utils";
import { useSearchParams } from "next/navigation";

import { Wallet, WalletStrategy, MsgBroadcaster } from '@injectivelabs/wallet-ts'
import { Web3Exception,
  WalletException,
  UnspecifiedErrorCode,
  ErrorType } from '@injectivelabs/exceptions'

const tabs = [
  { name: "Borrow", href: "0", current: false, lineColor: "#BF71DF" },
  { name: "Lend", href: "1", current: false, lineColor: "#E86B3A" },
  { name: "Earn", href: "2", current: false, lineColor: "#0EE29B" },
];
const chains = [
  { name: "INJ", icon: "./logo_injective.svg" },
  { name: "ATOM", icon: "./logo_atom.svg" },
  { name: "OSMO", icon: "./logo_osmo.svg" },
  { name: "stETH", icon: "./logo_stEth.svg" },
  { name: "USDT", icon: "./logo_usdt.svg" },
  { name: "wMATIC", icon: "./logo_matic.svg" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const PlaceOrderCard = ({ handleClick, yieldGraphOpen, setLineColor }) => {
  const params = useSearchParams();
  const [collateral, setCollateral] = useState("Select Asset");
  const [quantity, setQuantity] = useState("10");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [duration, setDuration] = useState("10");
  const [currentMode, setCurrentMode] = useState("Borrow");
  const [collateralLevel, setCollateralLevel] = useState(220);
  const [selectedChain, setSelectedChain] = useState(chains[0]);
  const [selectedChainCollateral, setSelectedChainCollateral] = useState(
    chains[0]
  );
  // console.log("params", );
 
  // function placeBorrowOrder(quantity, duration, chain, collateral) {
  //   let { privateKey, mnemonic } = PrivateKey.generate();
  //   const msg = MsgExecuteContractCompat.fromJSON({
  //     contractAddress,
  //     sender: injectiveAddress,
  //     exec: {
  //       action: "borrow",
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
 
  async function placeBorrowOrder(quantity, duration, chain, collateral) {
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
    
    const [address]  = await getAddresses();
    const injectiveAddress = address
    console.log(injectiveAddress)

    const msg = MsgExecuteContractCompat.fromJSON({
      contractAddress,
      sender: injectiveAddress,
      exec: {
        action: "borrow",
        funds: [
          {
            denom: INJ_DENOM,
            amount: new BigNumberInBase(quantity).toWei().toFixed(),
            duration : duration,
            quantity : quantity,
            collateral : {denom : INJ_DENOM, amount : new BigNumberInBase(collateral).toWei().toFixed(), }, //To Check 
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
    

    // const txHash = new MsgBroadcasterWithPk({
    //   PrivateKey, //Get this private key from wallet
    //   network: Network.Testnet
    // }).broadcast({
    //   msgs: msg
    // });

    return { quantity, duration, chain, collateral };
  }

  async function placeLendOrder(quantity, duration, chain) {
    console.log({ quantity, duration, chain });

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
    
    const [address]  = await getAddresses();
    const injectiveAddress = address
    console.log(injectiveAddress)

    const msg = MsgExecuteContractCompat.fromJSON({
      contractAddress,
      sender: injectiveAddress,
      exec: {
        action: "lend",
        funds: [
          {
            denom: INJ_DENOM,
            amount: new BigNumberInBase(quantity).toWei().toFixed(),
            duration : duration,
            quantity : quantity,
            //collateral : {denom : INJ_DENOM, amount : new BigNumberInBase(collateral).toWei().toFixed(), }, //To Check 
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

    return { quantity, duration, chain };
  }
  function placeEarnOrder(quantity, duration, chain) {
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
    let tab = params.get("tab");
    let chain = params.get("chain");
    if (chain)
      setSelectedChain(chains.find((singleChain) => singleChain.name == chain));
    if (tab)
      setCurrentMode(tabs.find((singleTab) => singleTab.href == tab)?.name);
  }, []);

  return (
    <div className="bg-[#15191ddf] backdrop-blur-[2px] py-4 xl:py-6 rounded-[2px] w-full flex flex-col xl:justify-between h-full min-h-[600px] ">
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
        <Listbox
          value={selectedChain}
          onChange={setSelectedChain}
          className="my-2 xl:my-4"
        >
          <div className="relative my-4">
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
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 max-h-60 w-[150px]  left-[50%] -translate-x-[50%] overflow-auto rounded-md  py-1 text-base  ring-1 ring-black ring-opacity-5  bg-[#15191D] z-[999]">
                {chains.map((chain, chainIdx) => (
                  <Listbox.Option
                    key={chainIdx}
                    className={({ active }) =>
                      `relative text-[#f2f2f2] cursor-default select-none py-2  px-4 ${
                        active ? "bg-gray-700 text-[#f2f2f2]" : "text-[#f2f2f2]"
                      }`
                    }
                    value={chain}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`flex items-center truncate ${
                            selectedChain ? "font-medium" : "font-normal"
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
        <div
          className={`flex items-center space-x-4 w-full px-6 2xl:px-16 ${
            currentMode !== "Borrow" ? "mb-4" : ""
          }`}
        >
          <div className="w-full">
            <label
              htmlFor="price"
              className="block text-xs xl:text-sm font-medium leading-6 text-gray-100"
            >
              Quantity
            </label>
            <div className="relative mt-1 xl:mt-2 rounded-md shadow-sm flex items-center ring-1 ring-inset ring-temporal50 bg-[#01080c] ">
              <input
                type="text"
                name="price"
                id="price"
                className="block w-full  rounded-[3px] border-0 py-1 xl:py-2 pl-7 pr-12 text-[#f2f2f2]  placeholder:text-gray-200 focus:ring-transparent bg-transparent "
                placeholder="0.00"
                aria-describedby="price-currency"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              {currentPrice && (
                <span className="flex items-center w-max flex-nowrap break-keep text-white text-sm pr-4">
                  ${currentPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          <div className="w-full">
            <label
              htmlFor="price"
              className="block text-xs xl:text-sm font-medium leading-6 text-gray-100"
            >
              Duration
            </label>
            <div className="relative mt-1 xl:mt-2 rounded-md shadow-sm">
              <input
                type="text"
                name="price"
                id="price"
                className="block w-full  rounded-[3px] border-0 py-1 xl:py-2 pl-7 pr-12 text-[#f2f2f2] ring-1 ring-inset ring-temporal50 placeholder:text-gray-200 focus:ring-temporal50 bg-[#01080c]"
                placeholder="0.00"
                aria-describedby="price-currency"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-[#f2f2f2] sm:text-sm" id="price-currency">
                  Days
                </span>
              </div>
            </div>
          </div>
        </div>
        {currentMode == "Borrow" && (
          <div className=" px-6 2xl:px-16 ">
            <label
              htmlFor="price"
              className="block text-xs xl:text-sm font-medium leading-6 text-gray-100 mt-4"
            >
              Collateral Assets
            </label>
            <Listbox
              value={selectedChainCollateral}
              onChange={setSelectedChainCollateral}
              className="mb-2 mt-1 xl:mb-4 xl:mt-2"
            >
              <div className="relative my-4">
                <Listbox.Button className="relative  border border-temporal50 w-full cursor-default rounded-[4px]  py-1 xl:py-2 pl-3 pr-10 text-left bg-[#01080c] ">
                  <span className=" truncate flex text-sm xl:text-md items-center text-[#f2f2f2]">
                    <img
                      alt={selectedChainCollateral.name}
                      src={selectedChainCollateral.icon}
                      className="w-5 mr-2"
                    />{" "}
                    {selectedChainCollateral.name}
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
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute border border-temporal mt-1 max-h-60 w-full overflow-auto rounded-md  py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 bg-[#15191D]">
                    {chains.map((chain, chainIdx) => (
                      <Listbox.Option
                        key={chainIdx}
                        className={({ active }) =>
                          `relative text-[#f2f2f2] cursor-default select-none py-2 text-sm xl:text-md px-4 ${
                            active
                              ? "bg-gray-700 text-[#f2f2f2]"
                              : "text-[#f2f2f2]"
                          }`
                        }
                        value={chain}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`flex items-center truncate ${
                                selectedChainCollateral
                                  ? "font-medium"
                                  : "font-normal"
                              }`}
                            >
                              <img
                                alt={chain.name}
                                src={chain.icon}
                                className="w-5 mr-2"
                              />{" "}
                              {chain.name}
                              {chain.name == selectedChainCollateral.name && (
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
            <label
              htmlFor="price"
              className="block text-xs xl:text-sm font-medium leading-6 text-gray-100 mt-2 mb-1.5 xl:mt-4 xl:mb-3"
            >
              Collateral Level
            </label>
            <div className="mb-4">
              <div className="flex justify-between text-gray-400 font-light text-xs">
                <span>100%</span>
                <span>120%</span>
                <span>140%</span>
                <span>160%</span>
                <span>180%</span>
                <span>200%</span>
                <span>220%</span>
                <span>240%</span>
                <span>260%</span>
                <span>280%</span>
                <span>300%</span>
              </div>
              <input
                type="range"
                min="100"
                max="300"
                value={collateralLevel}
                onChange={(e) => setCollateralLevel(e.target.value)}
                className="w-full "
              />
            </div>
          </div>
        )}
        <div className="mb-4 bg-[#036B681A] border border-temporal50 py-2 px-4 mx-6 2xl:mx-16 rounded-[3px]">
          <div className="text-[#f2f2f2] text-xs xl:text-sm">
            Estimated Yield:
          </div>
          <div className="text-temporal text-md xl:text-xl">
            {collateralLevel}%
          </div>
        </div>
      </div>
      <button
        className="w-[350px] mx-auto mt-2 py-2 bg-temporal text-black rounded-[4px]"
        onClick={() => {
          switch (currentMode) {
            case "Borrow":
              return placeBorrowOrder(
                quantity,
                duration,
                selectedChain.name,
                selectedChainCollateral.name
              );
            case "Lend":
              return placeLendOrder(quantity, duration, selectedChain.name);
            case "Earn":
              return placeEarnOrder(quantity, duration, selectedChain.name);
            default:
              break;
          }
        }}
      >
        ORDER
      </button>
    </div>
  );
};

export default PlaceOrderCard;
