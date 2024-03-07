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
  ChainRestAuthApi,
  TxRaw,
  CosmosTxV1Beta1Tx,
  BroadcastModeKeplr,
  BaseAccount,
  ChainRestTendermintApi,
  createTransaction,
  getTxRawFromTxRawOrDirectSignResponse,
  TxRestClient,
  getGasPriceBasedOnMessage,
  MsgBroadcasterWithPk,
} from "@injectivelabs/sdk-ts";
import { INJ_DENOM } from "@injectivelabs/sdk-ui-ts";
import { Network, getNetworkEndpoints } from '@injectivelabs/networks';
// import { getNetworkEndpoints } from '@injectivelabs/networks';
import { ChainId } from "@injectivelabs/ts-types";

import { BigNumberInBase, DEFAULT_BLOCK_TIMEOUT_HEIGHT, getDefaultStdFee, getStdFee } from "@injectivelabs/utils";
import { useRouter } from 'next/router';
import Image from 'next/image';
import Xarrow from "react-xarrows";

import { Wallet, WalletStrategy, MsgBroadcaster } from '@injectivelabs/wallet-ts'
import {
  Web3Exception,
  WalletException,
  UnspecifiedErrorCode,
  ErrorType,
  TransactionException
} from '@injectivelabs/exceptions'

import { PlaceOrderCardProps } from '@/types/Components';

import { ChainInfo, Window as KeplrWindow, SignDoc } from "@keplr-wallet/types";
import { BroadcastMode } from '@keplr-wallet/types'

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
const durationOptions = [
  { id: 1, name: '1 day' },
  { id: 2, name: '7 days' },
  { id: 3, name: '30 days' },
  { id: 4, name: '60 days' },
  { id: 5, name: '90 days' },
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
  const [selectedMintDuration, setselectedMintDuration] = useState(durationOptions[2]);
  const [mintDuration, setMintDuration] = useState('');


  const [RedeemAmount, setRedeemAmount] = useState('');

  const [PTTradeValue, setPTTradeValue] = useState('');
  const [YTTradeValue, setYTTradeValue] = useState('');
  const [isPTActive, setIsPTActive] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

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
    }, 500);
  };

  const getTestnetChainInfo = (): ChainInfo => ({
    chainId: "injective-777",
    chainName: "injective",
    rpc: "http://100.109.95.94:26657",
    rest: "http://100.109.95.94:10337",
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "inj",
      bech32PrefixAccPub: "inj" + "pub",
      bech32PrefixValAddr: "inj" + "valoper",
      bech32PrefixValPub: "inj" + "valoperpub",
      bech32PrefixConsAddr: "inj" + "valcons",
      bech32PrefixConsPub: "inj" + "valconspub",
    },
    currencies: [
      {
        coinDenom: "inj",
        coinMinimalDenom: "inj",
        coinDecimals: 18,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "inj",
        coinMinimalDenom: "inj",
        coinDecimals: 18,
      },
    ],
    stakeCurrency: {
      coinDenom: "inj",
      coinMinimalDenom: "inj",
      coinDecimals: 18,
    },
  })

  const getKeplr = async (chainId: string) => {
    if (!window.keplr) {
      alert("Please install keplr extension");
    } else {
      await window.keplr.enable(chainId);

      const offlineSigner = window.keplr.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();

      // console.log(accounts)
      const key = await window.keplr.getKey(chainId);

      return { offlineSigner, accounts, key };
    }
  };

  const broadcastTx = async (chainId: string, txRaw: TxRaw) => {
    // const keplr = await getKeplr(chainId);

    if (!window.keplr) {
      throw new Error("Keplr instance not found");
    }

    await window.keplr.enable(chainId);

    const result = await window.keplr.sendTx(
      chainId,
      CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish(),
      BroadcastModeKeplr.Sync as unknown as BroadcastMode.Sync
    );

    if (!result || result.length === 0) {
      throw new TransactionException(
        new Error("Transaction failed to be broadcasted"),
        { contextModule: "Keplr" }
      );
    }

    return Buffer.from(result).toString("hex");
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


  // -------------------------TestnetCode---------------------------------------
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
  // -------------------------TestnetCode---------------------------------------

  async function getBalance() {
    if (!window.keplr) {
      alert("POC Please install keplr extension");
    } else {

      try {
        await window.keplr.experimentalSuggestChain(getTestnetChainInfo())
      } catch (error) {
        console.log(error)
      }
      await window.keplr.enable(ChainId.Devnet);

      //----------------------------KEPLR NO SET FEE------------------------------------
      window.keplr.defaultOptions = {
        sign: {
          preferNoSetFee: true,
        }
      }
      const offlineSigner = window.keplr.getOfflineSigner!(ChainId.Devnet)
      const [account] = await offlineSigner.getAccounts();

      const endpoint = "http://100.109.95.94:26657/";

      try {
        const client =
          await InjectiveStargate.InjectiveSigningStargateClient.connectWithSigner(
            endpoint,
            offlineSigner
          );
        const balances = await client.getAllBalances(account.address);
        console.log("Account: ", account);
        console.log("Balances", balances);
        // if (balances.length !== 0) {
        //   return balances[3].amount;
        // }
        // else {
        //   return 0;
        // }
        return balances
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

  // -----------------------WALLETSTRATEGY DEFAULT-----------------------------------------
  // async function placeMintOrder(
  //   mintAmount: string,
  //   mintDuration: string,
  //   selectedMintChain: string,
  // ) {
  //   console.log({ mintAmount, mintDuration, selectedMintChain });

  //   const contractAddress = "inj14hj2tavq8fpesdwxxcu44rty3hh90vhujaxlnz";

  //   const NETWORK = Network.Mainnet

  //   const walletStrategy = new WalletStrategy({
  //     chainId: ChainId.Mainnet,
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
  //     networkEndpoints: {
  //       indexer: "http://100.109.95.94:1317/indexer/",
  //       grpc: "http://100.109.95.94:26657/",
  //       rest: "http://100.109.95.94:10337/",
  //       chronos: "http://100.109.95.94:1317/chronos/",
  //       explorer: "http://100.109.95.94:1317/explorer/",
  //     }
  //   })

  //   console.log(msgBroadcastClient)

  //   const [address] = await getAddresses();
  //   const injectiveAddress = address
  //   console.log(injectiveAddress)

  //   const msg = MsgExecuteContract.fromJSON({
  //     contractAddress,
  //     sender: injectiveAddress,
  //     msg: {
  //       lend_to_pool_v2: {
  //         lender: injectiveAddress,
  //         amount: new BigNumberInBase(mintAmount).toWei().toFixed(),
  //         duration: parseInt(mintDuration)
  //       },
  //     },
  //   });

  //   try {
  // const txHash = await msgBroadcastClient.broadcast({
  //       msgs: msg,
  //       injectiveAddress: injectiveAddress,
  //     });

  //     console.log(txHash);
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //   }

  //   return { mintAmount, mintDuration, selectedMintChain };
  // }

  // -----------------------WALLETSTRATEGY CHANGED-----------------------------------------

  async function placeMintOrder(
    mintAmount: string,
    mintDuration: string,
    selectedMintChain: string,
  ) {
    console.log({ mintAmount, mintDuration, selectedMintChain });

    const contractAddress = "inj14hj2tavq8fpesdwxxcu44rty3hh90vhujaxlnz";

    const NETWORK = Network.Local;

    const walletStrategy = new WalletStrategy({
      chainId: ChainId.Devnet,
      endpoints: {
        rpc: "http://100.109.95.94:26657",
        rest: "http://100.109.95.94:10337",
      }
    })

    const pubKey = await walletStrategy.getPubKey();
    console.log("pubkey: ", pubKey);

    const getAddresses = async (): Promise<string[]> => {

      const addresses = await walletStrategy.getAddresses();

      if (addresses.length === 0) {
        throw new Web3Exception(
          new Error("There are no addresses linked in this wallet.")
        );
      }

      return addresses;
    };

    // console.log(walletStrategy)

    const msgBroadcastClient = new MsgBroadcaster({
      walletStrategy,
      network: NETWORK,
      feePayerPubKey: pubKey,
      networkEndpoints: {
        indexer: "http://100.109.95.94:1317/indexer/",
        grpc: "http://100.109.95.94:9091",
        rest: "http://100.109.95.94:10337",
        chronos: "http://100.109.95.94:1317/chronos/",
        explorer: "http://100.109.95.94:1317/explorer/",
      },
    })

    // console.log(msgBroadcastClient)

    const [address] = await getAddresses();
    const injectiveAddress = address
    console.log("Sender: ", injectiveAddress)

    const recipientAddress = "inj1qjayaq7fjlf2kma8t2ssx54lht7mmp00ahh7yp";
    const msg = MsgExecuteContract.fromJSON({
      contractAddress,
      sender: injectiveAddress,
      msg: {
        mint_trade_tokens: {
          recipient: injectiveAddress,
          amount: new BigNumberInBase(mintAmount).toWei().toFixed(),
        },
      },
    });



    // -----------------------------TRANSFER-----------------------------------
    // const recipientAddress = "inj1qjayaq7fjlf2kma8t2ssx54lht7mmp00ahh7yp";
    // const msg = MsgExecuteContract.fromJSON({
    //   contractAddress,
    //   sender: injectiveAddress,
    //   msg: {
    //     transfer: {
    //       recipient: recipientAddress,
    //       amount: new BigNumberInBase(100000).toWei().toFixed(),
    //     },
    //   },
    // });

    // const msg = MsgExecuteContractCompat.fromJSON({
    //   contractAddress,
    //   sender: injectiveAddress,
    //   exec: {
    //     action: "transfer",
    //     msg: [
    //       {
    //         recipient: injectiveAddress,
    //         amount: new BigNumberInBase(1).toWei().toFixed(),

    //       },
    //     ],
    //   },
    // });


    // -----------------------------QUERY-----------------------------------
    // try {
    //   const chainGrpcWasmApi = new ChainGrpcWasmApi("http://100.109.95.94:9091");

    //   const queryObj = { token_info: {} };
    //   const json = JSON.stringify(queryObj);
    //   const b64Query = Buffer.from(json).toString('base64');

    //   const contractInfo = await chainGrpcWasmApi.fetchContractInfo(contractAddress)
    //   console.log("contractInfo", contractInfo);

    //   const contractState = await chainGrpcWasmApi.fetchSmartContractState(contractAddress, b64Query);

    //   console.log("contractState", contractState);


    // } catch (error) {
    //   console.error("An error occurred with query:", error);
    // }

    try {
      const txHash = await msgBroadcastClient.broadcast({
        msgs: msg,
        injectiveAddress: injectiveAddress,
      });

      console.log(txHash);
    } catch (error) {
      console.error("An error occurred:", error);
    }

    return { mintAmount, mintDuration, selectedMintChain };
  }

  // -----------------------BROADCASTER PK-----------------------------------------
  // async function placeMintOrder(
  //   mintAmount: string,
  //   mintDuration: string,
  //   selectedMintChain: string,
  // ) {
  //   console.log({ mintAmount, mintDuration, selectedMintChain });

  //   const contractAddress = "inj14hj2tavq8fpesdwxxcu44rty3hh90vhujaxlnz";
  //   const privateKey = '3f62c9dbf5dafe3f3eea86863bc2ff3fb985c5e9be5f651da9ed2a6b4cb2c161'
  //   const chainId = "injectivetemporal-1";

  //   const keplerData = await getKeplr(chainId);

  //   if (!keplerData) {
  //     throw new Error("Key is undefined");
  //   }

  //   const injectiveAddress = keplerData.key.bech32Address;

  //   console.log(injectiveAddress)

  //   const msg = MsgExecuteContract.fromJSON({
  //     contractAddress,
  //     sender: injectiveAddress,
  //     msg: {
  //       lend_to_pool_v2: {
  //         lender: injectiveAddress,
  //         amount: new BigNumberInBase(mintAmount).toWei().toFixed(),
  //         duration: parseInt(mintDuration)
  //       },
  //     },
  //   });

  //   try {
  //     const txHash = await new MsgBroadcasterWithPk({
  //       privateKey,
  //       network: "injectivetemporal" as Network,
  //       endpoints: {
  //         indexer: "http://100.109.95.94:1317/indexer/",
  //         grpc: "http://100.109.95.94:26657/",
  //         rest: "http://100.109.95.94:10337/",
  //       }
  //     }).broadcast({
  //       msgs: msg
  //     })
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //   }

  //   return { mintAmount, mintDuration, selectedMintChain };
  // }

  // -----------------------NO WALLETSTRATEGY DEFAULT-----------------------------------------
  // async function placeMintOrder(
  //   mintAmount: string,
  //   mintDuration: string,
  //   selectedMintChain: string,
  // ) {
  //   console.log({ mintAmount, mintDuration, selectedMintChain });

  //   const contractAddress = "inj14hj2tavq8fpesdwxxcu44rty3hh90vhujaxlnz";

  //   // ----------------------------------------------------------------
  //   // No WalletStrategy

  //   const chainId = "injectivetemporal-1";
  //   const keplerData = await getKeplr(chainId);

  //   if (!keplerData) {
  //     throw new Error("Key is undefined");
  //   }

  //   const pubKey = Buffer.from(keplerData.key.pubKey).toString("base64");

  //   const [account] = await keplerData.offlineSigner.getAccounts();

  //   const injectiveAddress = keplerData.key.bech32Address;

  //   const rpcEndpoint = "http://100.109.95.94:26657";
  //   const restEndpoint = "http://100.109.95.94:10337";

  //   /** Account Details **/
  //   const chainRestAuthApi = new ChainRestAuthApi(restEndpoint);
  //   const accountDetailsResponse = await chainRestAuthApi.fetchAccount(
  //     injectiveAddress
  //   );
  //   const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse);

  //   console.log("Base Account", baseAccount);

  //   /** Block Details */
  //   const chainRestTendermintApi = new ChainRestTendermintApi(restEndpoint);
  //   const latestBlock = await chainRestTendermintApi.fetchLatestBlock();
  //   const latestHeight = latestBlock.header.height;
  //   const timeoutHeight = new BigNumberInBase(latestHeight).plus(
  //     DEFAULT_BLOCK_TIMEOUT_HEIGHT
  //   );

  //   const msg = MsgExecuteContract.fromJSON({
  //     contractAddress,
  //     sender: injectiveAddress,
  //     msg: {
  //       TokenInfo : {},
  //     },
  //   });

  //   // const msg = MsgExecuteContract.fromJSON({
  //   //   contractAddress,
  //   //   sender: injectiveAddress,
  //   //   msg: {
  //   //     MintTradeTokens: {
  //   //       recipient : injectiveAddress,
  //   //       amount: new BigNumberInBase(mintAmount).toWei().toFixed(),
  //   //     },
  //   //   },
  //   // });

  //   const fee = getDefaultStdFee()
  //   console.log("Fee", fee)

  //   const { signDoc } = createTransaction({
  //     pubKey,
  //     chainId,
  //     fee: fee,
  //     message: msg,
  //     sequence: baseAccount.sequence,
  //     timeoutHeight: timeoutHeight.toNumber(),
  //     accountNumber: baseAccount.accountNumber,
  //   });

  //   console.log(signDoc)

  //   const directSignResponse = await keplerData.offlineSigner.signDirect(
  //     injectiveAddress,
  //     signDoc as unknown as SignDoc
  //   );

  //   try {

  //     const txRaw = getTxRawFromTxRawOrDirectSignResponse(directSignResponse);
  //     const txHash = await broadcastTx(chainId, txRaw);
  //     const response = await new TxRestClient(restEndpoint).fetchTxPoll(txHash);

  //     console.log('Transaction successfully broadcasted and confirmed:', response);
  //   } catch (error) {
  //     console.error('Error executing transaction:', error);
  //     // throw error;
  //   }
  //   // ----------------------------------------------------------------

  //   return { mintAmount, mintDuration, selectedMintChain };
  // }

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
        setCurrentBalance(Number(balance) / 1e+18);
      } else {
        setCurrentBalance(0);
      }
    }
    y();
  }, [mintMode]);


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
            className="focus:outline-none py-2 w-24 border-0 text-gray-400 bg-transparent text-center"
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
            <span className="text-gray-400 mx-0 mb-6 text-xs">[Underlying APY {selectedChain.apy}]</span>

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
                    type="number"
                    name="price-bottom"
                    id="price-bottom"
                    className="flex-grow border-0 rounded-md py-3 xl:py-4 pl-7 text-white bg-transparent focus:outline-none"
                    placeholder="0.00"
                    aria-describedby="price-addon apy-addon"
                    value={isPTActive ? YTTradeValue : PTTradeValue}
                    onChange={(e) => isPTActive ? setYTTradeValue(e.target.value) : setPTTradeValue(e.target.value)}
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
                  <Listbox.Button className="flex justify-between items-center relative w-full border-0 rounded-md py-3 xl:py-4 px-7 text-white bg-transparent focus:outline-none">
                    <span className="block truncate">{selectedMintDuration.name}</span>
                    <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
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
                    {/* Removed style={{ width: 'auto' }} to allow Listbox.Options to expand to the full width of its parent */}
                    <Listbox.Options className="absolute w-full mt-1 bg-[#15191D] rounded-md shadow-lg max-h-60 py-1 z-10">
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
              console.log("YT Value: " + YTTradeValue + " PT Value: " + PTTradeValue)

              return placeTradeOrder(
                quantity,
                duration,
                selectedChain.name,
                collateralLevel
              );
            case "Earn":
              return placeEarnOrder(quantity, duration, selectedChain.name);
            case "Mint":
              return placeMintOrder(mintAmount, mintDuration, selectedMintChain.name);
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
