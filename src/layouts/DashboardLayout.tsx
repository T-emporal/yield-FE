import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import {
  MsgSend,
  BaseAccount,
  ChainRestAuthApi,
  createTransaction,
  CosmosTxV1Beta1Tx,
  ChainRestTendermintApi,
  getTxRawFromTxRawOrDirectSignResponse,
  TxRestClient,
  BroadcastModeKeplr,
  createCosmosSignDocFromSignDoc,
  SIGN_DIRECT,
  IndexerGrpcOracleApi,
  InjectiveStargate,
} from "@injectivelabs/sdk-ts";
import {
  DEFAULT_STD_FEE,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
  BigNumberInBase,
} from "@injectivelabs/utils";
import { TransactionException } from '@injectivelabs/exceptions'
import { BroadcastMode } from '@keplr-wallet/types'
import { ChainId } from "@injectivelabs/ts-types";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";
import { SigningStargateClient } from "@cosmjs/stargate";
import { json } from "stream/consumers";
import Image from 'next/image';

import { Window as KeplrWindow } from "@keplr-wallet/types";
declare global {
  interface Window extends KeplrWindow { }
}
import { OrbPosition, OrbIdentifier, LayoutProps } from '@/types/Layout';

const navigation = [
  {
    name: "Markets",
    href: "/",
    icon: "/icon_markets.svg",
    iconSelected: "/icon_markets_selected.svg",
  },
  {
    name: "Trade",
    href: "/trade",
    icon: "/icon_orders.svg",
    iconSelected: "/icon_orders_selected.svg",
  },
  {
    name: "Portfolio",
    href: "/portfolio",
    icon: "/icon_positions.svg",
    iconSelected: "/icon_positions_selected.svg",
  },
];
export async function getOraclePrice(baseSymbol = "INJ") {
  const endpoints = getNetworkEndpoints(Network.Mainnet);
  const indexerGrpcOracleApi = new IndexerGrpcOracleApi(endpoints.indexer);

  const quoteSymbol = "USDT";
  const oracleType = "bandibc"; // primary oracle we use

  const oraclePrice = await indexerGrpcOracleApi.fetchOraclePriceNoThrow({
    baseSymbol,
    quoteSymbol,
    oracleType,
  });

  console.log("oraclePrice", oraclePrice.price);
  return oraclePrice.price;
}
// function DashboardLayout({ children, activePage }) {
//   const [publicAddress, setPublicAddress] = useState("");
//   const [txHash, setTxHash] = useState("");
//   const getKeplr = async (chainId) => {
//     await window.keplr.enable(chainId);

//     const offlineSigner = window.keplr.getOfflineSigner(chainId);
//     const accounts = await offlineSigner.getAccounts();
//     const key = await window.keplr.getKey(chainId);

//   return { offlineSigner, accounts, key };
// };
const DashboardLayout = ({ children, activePage }: LayoutProps) => {
  const [publicAddress, setPublicAddress] = useState("");
  const [txHash, setTxHash] = useState("");
  const router = useRouter();


  const [topLeftOrbPosition, setTopLeftOrbPosition] = useState<OrbPosition>({ top: '-5vh', left: '-10vw', bottom: '', right: '' });
  const [bottomRightOrbPosition, setBottomRightOrbPosition] = useState<OrbPosition>({ top: '', left: '', bottom: '-5vh', right: '-10vw' });

  

  useEffect(() => {
    const currentPath = router.pathname;

    const updateOrbPositionsBasedOnPath = (navName: string) => {

      let newPositionTopLeft = { ...topLeftOrbPosition };
      let newPositionBottomRight = { ...bottomRightOrbPosition };
  
      switch (navName) {
        case "/":
          newPositionTopLeft = { top: '5vw', left: '5vh' };
          newPositionBottomRight = { bottom: '5vw', right: '5vw' };
          break;
        case "/trade":
          newPositionTopLeft = { top: '10vw', left: '20vh' };
          newPositionBottomRight = { bottom: '10vw', right: '20vw' };
          break;
        case "/portfolio":
          newPositionTopLeft = { top: '15vw', left: '35vh' };
          newPositionBottomRight = { bottom: '15vw', right: '15vw' };
          break;
      }
  
      setTopLeftOrbPosition(newPositionTopLeft);
      setBottomRightOrbPosition(newPositionBottomRight);
    };

    updateOrbPositionsBasedOnPath(currentPath);
  }, [router.pathname]);

  useEffect(() => {
    let wallet_address = window.localStorage.getItem("wallet_address");
    if (wallet_address) setPublicAddress(wallet_address);
  }, []);
  useEffect(() => {
    if (publicAddress) {
      const x = async () => {
        // console.log("Network Endpoint: "+getNetworkEndpoints(Network.Testnet).rest)
        // console.log("Network Endpoint: "+JSON.stringify(getNetworkEndpoints(Network.TestnetSentry).rpc))
        // console.log("Offline signer: "+JSON.stringify(window.keplr.getOfflineSigner(ChainId.TestnetSentry)))
        // console.log("Offline signer: "+JSON.stringify(ChainId))
        // const client = await SigningStargateClient.connectWithSigner(
        //   getNetworkEndpoints(Network.TestnetSentry).rest,
        //   window.keplr.getOfflineSigner(ChainId.Testnet)
        // );

        // const client =
        // await InjectiveStargate.InjectiveSigningStargateClient.connectWithSigner(
        //   getNetworkEndpoints(Network.TestnetSentry).rest,
        //   window.keplr.getOfflineSigner(ChainId.Testnet),
        // );

        if (!window.keplr) {
          alert("Please install keplr extension");
        } else {
          await window.keplr.enable(ChainId.Testnet);
          const offlineSigner = window.keplr.getOfflineSigner(ChainId.Testnet);
          const [account] = await offlineSigner.getAccounts();

          // Initialize the stargate client
          const endpoints = getNetworkEndpoints(Network.TestnetSentry).rpc ?? "https://testnet.sentry.tm.injective.network:443";

          const client =
            await InjectiveStargate.InjectiveSigningStargateClient.connectWithSigner(
              endpoints,
              offlineSigner
            );

          // console.log(client)
          // const balances = await client.getAllBalances(account.address);
          // console.log("Balances", balances);
        }
      }
      x();
    }
  }, [publicAddress]);


  async function connectWallet() {

    if (!window.keplr) {
      alert("Please install keplr extension");
    } else {
      await window.keplr.enable(ChainId.Testnet);
      const offlineSigner = window.keplr.getOfflineSigner(ChainId.Testnet);
      const [account] = await offlineSigner.getAccounts();
      setPublicAddress(account.address);
    }

    return;
  }

  const getKeplr = async (chainId: string) => {

    if (!window.keplr) {
      alert("Please install keplr extension");

    } else {
      await window.keplr.enable(chainId)

      const offlineSigner = window.keplr.getOfflineSigner(chainId)
      const accounts = await offlineSigner.getAccounts()
      const key = await window.keplr.getKey(chainId)

      return { offlineSigner, accounts, key }
    }

  }

  const executeTransaction = async () => {
    // Define your functions and variables here

    const broadcastTx = async (chainId: string, txRaw: CosmosTxV1Beta1Tx.TxRaw) => {

      if (!window.keplr) {
        alert("Please install keplr extension");
      } else {
        const result = await window.keplr.sendTx(
          chainId,
          CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish(),
          BroadcastMode.Sync
        );

        if (!result || result.length === 0) {
          throw new TransactionException(
            new Error("Transaction failed to be broadcasted"),
            { contextModule: "Keplr" }
          );
        }

        return Buffer.from(result).toString("hex");
      }


    };
    const chainId = ChainId.Testnet;

    const keplrResult = await getKeplr(chainId);
    if (keplrResult) {
      const { offlineSigner, accounts, key } = keplrResult;
      const pubKey = Buffer.from(key.pubKey).toString("base64");
      const injectiveAddress = key.bech32Address;
      const restEndpoint = getNetworkEndpoints(
        Network.Testnet
      ).rest; /* getNetworkEndpoints(Network.Mainnet).rest */
      const amount = {
        amount: new BigNumberInBase(0.01).toWei().toFixed(),
        denom: "inj",
      };

      /** Account Details **/
      const chainRestAuthApi = new ChainRestAuthApi(restEndpoint);
      const accountDetailsResponse = await chainRestAuthApi.fetchAccount(
        injectiveAddress
      );
      const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse);
      const accountDetails = baseAccount.toAccountDetails();

      /** Block Details */
      const chainRestTendermintApi = new ChainRestTendermintApi(restEndpoint);
      const latestBlock = await chainRestTendermintApi.fetchLatestBlock();
      const latestHeight = latestBlock.header.height;
      const timeoutHeight = new BigNumberInBase(latestHeight).plus(
        DEFAULT_BLOCK_TIMEOUT_HEIGHT
      );

      /** Preparing the transaction */
      const msg = MsgSend.fromJSON({
        amount,
        srcInjectiveAddress: injectiveAddress,
        dstInjectiveAddress: "inj17xxadj7e9ermxnq7jl5t2zxu5pknhahac8ma8e",
      });

      try {
        const { signDoc } = createTransaction({
          pubKey,
          chainId,
          fee: DEFAULT_STD_FEE,
          signMode: SIGN_DIRECT,
          message: [msg],
          sequence: baseAccount.sequence,
          timeoutHeight: timeoutHeight.toNumber(),
          accountNumber: baseAccount.accountNumber,
        });

        const directSignResponse = await offlineSigner.signDirect(
          injectiveAddress,
          createCosmosSignDocFromSignDoc(signDoc)
        );
        const txRaw = getTxRawFromTxRawOrDirectSignResponse(directSignResponse);
        const txHash = await broadcastTx(ChainId.Testnet, txRaw) ?? "";
        console.log({ txHash });
        const response = await new TxRestClient(restEndpoint).fetchTxPoll(txHash);
        console.log({ response });
        setTxHash(txHash);
      } catch (error) {
        console.error("Error executing transaction:", error);
      }
    } else {
      console.error("Keplr didn't return any results");
    }

  };

  return (
    <main
      style={{ backgroundImage: 'url("/Background_clean.svg")' }}
      className="bg-cover h-screen w-screen pt-[20px] bg-fixed overflow-y-scroll pb-12 relative"
    >
      <div
        className="orb top-left"
        style={{ top: topLeftOrbPosition.top, left: topLeftOrbPosition.left }}
      ></div>
      <div
        className="orb bottom-right"
        style={{ bottom: bottomRightOrbPosition.bottom, right: bottomRightOrbPosition.right }}
      ></div>

      <header className="flex items-center justify-between">
        <div className="flex items-center bg-fixed z-10">
          <Image
            src={"/TemporalLogoSmall.svg"}
            alt="Temporal Logo"
            className="ml-16"
            width={100} 
            height={100}
          />
          {navigation.map((singleNav) => (
            <Link
              key={singleNav.href}
              href={singleNav.href}
              className={`flex items-center uppercase ml-[52px] ${singleNav.name == activePage
                ? "text-[#0ABAB5]"
                : "text-[#f2f2f2]"
                }`}
            >
              <Image
                src={
                  singleNav.name == activePage
                    ? singleNav.iconSelected
                    : singleNav.icon
                }
                alt="Navigation Icons"
                height={20}
                width={20}
                className="mr-2 "
              />{" "}
              {singleNav.name}
            </Link>
          ))}
        </div>
        {publicAddress ? (
          <>
            <button className="font-proxima-nova mr-16 flex justify-center rounded-md border-2 border-[#008884] bg-[#008884] py-3 px-6 font-normal text-black hover:border-[#008884] hover:bg-black hover:text-[#008884] z-10">
              {publicAddress.slice(0, 5)}...
              {publicAddress.slice(
                publicAddress.length - 4,
                publicAddress.length
              )}
            </button>

            {/* <button
              className="font-proxima-nova mr-16 flex justify-center rounded-md border-2 border-[#008884] bg-[#008884] py-3 px-6 font-normal text-black hover:border-[#008884] hover:bg-black hover:text-[#008884]"
              onClick={executeTransaction}
            >
              Transact
            </button> */}
          </>
        ) : (
          <button
            onClick={connectWallet}
            className="font-proxima-nova mr-16 flex justify-center rounded-md border-2 border-[#008884] bg-[#008884] py-3 px-6 font-normal text-black hover:border-[#008884] hover:bg-black hover:text-[#008884]"
          >
            Connect Wallet
          </button>
        )}
      </header>
      <section className="max-w-[95vw] mx-auto">{children}</section>
      <footer></footer>
    </main>
  );
}

export default DashboardLayout;
