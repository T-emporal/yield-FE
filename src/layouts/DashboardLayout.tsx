import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  MsgSend,
  BaseAccount,
  ChainRestAuthApi,
  createTransaction,
  CosmosTxV1Beta1Tx,
  ChainRestTendermintApi,
  getTxRawFromTxRawOrDirectSignResponse,
  TxRestClient,
  BroadcastMode,
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
import { ChainId } from "@injectivelabs/ts-types";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";
import { SigningStargateClient } from "@cosmjs/stargate";
import { json } from "stream/consumers";

const navigation = [
  {
    name: "Markets",
    href: "/",
    icon: "/icon_markets.svg",
    iconSelected: "/icon_markets_selected.svg",
  },
  {
    name: "Orders",
    href: "/orders",
    icon: "/icon_orders.svg",
    iconSelected: "/icon_orders_selected.svg",
  },
  {
    name: "Positions",
    href: "/positions",
    icon: "/icon_positions.svg",
    iconSelected: "/icon_positions_selected.svg",
  },
  {
    name: "Statistics",
    href: "/statistics",
    icon: "/icon_stats.svg",
    iconSelected: "/icon_stats_selected.svg",
  },
];
export async function getOraclePrice(baseSymbol = "INJ") {
  const endpoints = getNetworkEndpoints(Network.Mainnet);
  const indexerGrpcOracleApi = new IndexerGrpcOracleApi(endpoints.indexer);

  const quoteSymbol = "USDT";
  const oracleType = "bandibc"; // primary oracle we use
  if (baseSymbol == "USDT") return 1;
  const oraclePrice = await indexerGrpcOracleApi.fetchOraclePriceNoThrow({
    baseSymbol,
    quoteSymbol,
    oracleType,
  });

  console.log("oraclePrice", oraclePrice.price);
  return oraclePrice.price;
}
export const getKeplr = async (chainId) => {
  await window.keplr.enable(chainId);

  const offlineSigner = window.keplr.getOfflineSigner(chainId);
  const accounts = await offlineSigner.getAccounts();
  const key = await window.keplr.getKey(chainId);

  return { offlineSigner, accounts, key };
};
function DashboardLayout({ children, activePage }) {
  const [publicAddress, setPublicAddress] = useState("");
  const [txHash, setTxHash] = useState("");
  useEffect(() => {
    let wallet_address = window.localStorage.getItem("wallet_address");
    if (wallet_address) setPublicAddress(wallet_address);
  }, []);
  useEffect(() => {
    if (publicAddress) {
      async function x() {
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

        await window.keplr.enable(ChainId.Testnet);
        const offlineSigner = window.getOfflineSigner(ChainId.Testnet);
        const [account] = await offlineSigner.getAccounts();

        // console.log("Offline signer: "+JSON.stringify(offlineSigner))
        // console.log("Account: "+JSON.stringify(account))

         // Initialize the stargate client
        const client =
        await InjectiveStargate.InjectiveSigningStargateClient.connectWithSigner(
          getNetworkEndpoints(Network.TestnetSentry).rpc,
          offlineSigner
          );

          // console.log(client)
        const balances = await client.getAllBalances(account.address);
        console.log("Balances", balances);
      }
      x();
    }
  }, [publicAddress]);

  async function connectWallet() {
    const { accounts } = await getKeplr(ChainId.Testnet);
    // if (!keplr) return;

    setPublicAddress(accounts[0].address);
    window.localStorage.setItem("wallet_address", accounts[0].address);
    //const cors=require("cors");
    //const corsOptions ={
    //   origin:'*',
    //   credentials:true,            //access-control-allow-credentials:true
    //   optionSuccessStatus:200,
    //}
    //
    //app.use(cors(corsOptions))

    // getOraclePrice();

    return;
  }

  const executeTransaction = async () => {
    // Define your functions and variables here

    const broadcastTx = async (chainId, txRaw) => {
      const result = await window.keplr.sendTx(
        chainId,
        CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish(),
        "sync"
      );

      if (!result || result.length === 0) {
        throw new TransactionException(
          new Error("Transaction failed to be broadcasted"),
          { contextModule: "Keplr" }
        );
      }

      return Buffer.from(result).toString("hex");
    };
    const chainId = ChainId.Testnet;
    const { key, offlineSigner } = await getKeplr(chainId);
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
      const txHash = await broadcastTx(ChainId.Testnet, txRaw);
      console.log({ txHash });
      const response = await new TxRestClient(restEndpoint).fetchTxPoll(txHash);
      console.log({ response });
      setTxHash(txHash);
    } catch (error) {
      console.error("Error executing transaction:", error);
    }
  };

  return (
    <main
      style={{ backgroundImage: 'url("/BG.png")' }}
      className="bg-cover h-screen w-screen pt-[20px] bg-fixed overflow-y-scroll pb-12"
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center ">
          <img
            src={"/TemporalLogoSmall.svg"}
            alt="Temporal Logo"
            className="ml-16"
          />
          {navigation.map((singleNav) => (
            <Link
              key={singleNav.href}
              href={singleNav.href}
              className={`flex items-center uppercase ml-[52px] ${
                singleNav.name == activePage
                  ? "text-[#0ABAB5]"
                  : "text-[#f2f2f2]"
              }`}
            >
              <img
                src={
                  singleNav.name == activePage
                    ? singleNav.iconSelected
                    : singleNav.icon
                }
                className="!w-4 !h-4 mr-2"
              />{" "}
              {singleNav.name}
            </Link>
          ))}
        </div>
        {publicAddress ? (
          <>
            <button className="font-proxima-nova mr-16 flex justify-center rounded-md border-2 border-[#008884] bg-[#008884] py-3 px-6 font-normal text-black hover:border-[#008884] hover:bg-black hover:text-[#008884]">
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
