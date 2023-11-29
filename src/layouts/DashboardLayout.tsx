import { CosmosClient } from "@cosmjs/launchpad";
import { StargateClient, SigningStargateClient } from "@cosmjs/stargate";
import Link from "next/link";
import React, { useState } from "react";
import Web3 from "web3";
// import { SigningStargateClient } from "@cosmjs/stargate";

let testWalletAddr = "inj17xxadj7e9ermxnq7jl5t2zxu5pknhahac8ma8e";

const chainId = "injective-888"; // Replace with your chain ID
const rpcEndpoint = "https://testnet.sentry.tm.injective.network:443"; // Replace with the RPC endpoint of your chain
import {
  MsgSend,
  BaseAccount,
  DEFAULT_STD_FEE,
  ChainRestAuthApi,
  createTransaction,
  CosmosTxV1Beta1Tx,
  ChainRestTendermintApi,
} from "@injectivelabs/sdk-ts";
import {
  // DEFAULT_STD_FEE,
  BigNumberInBase,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
} from "@injectivelabs/utils";
import { ChainId } from "@injectivelabs/ts-types";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";
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
function DashboardLayout({ children, activePage }) {
  const [publicAddress, setPublicAddress] = useState("");

  // ! ************************************************************************************************************** KEPLR
  async function getKeplr() {
    if (!window.keplr) {
      alert("Please install Keplr extension");
      return;
    }
    await window.keplr.enable("injective-888"); // Example: Enable the Cosmos Hub chain
    const keplr = window.keplr;
    return keplr;
  }
  async function createAndSignTransaction(
    injectiveAddress,
    chainId,
    restEndpoint,
    amount
  ) {
    const getKeplr = async (chainId) => {
      await window.keplr.enable(chainId);
      const offlineSigner = window.keplr.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
      const key = await window.keplr.getKey(chainId);
      return { offlineSigner, accounts, key };
    };

    const broadcastTx = async (chainId, txRaw) => {
      const keplr = await getKeplr(chainId);
      const result = await keplr.sendTx(
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
    };

    // Account Details
    const chainRestAuthApi = new ChainRestAuthApi(restEndpoint);
    const accountDetailsResponse = await chainRestAuthApi.fetchAccount(
      injectiveAddress
    );
    const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse);
    const accountDetails = baseAccount.toAccountDetails();

    // Block Details
    const chainRestTendermintApi = new ChainRestTendermintApi(restEndpoint);
    const latestBlock = await chainRestTendermintApi.fetchLatestBlock();
    const latestHeight = latestBlock.header.height;
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(
      DEFAULT_BLOCK_TIMEOUT_HEIGHT
    );

    // Preparing the transaction
    const msg = MsgSend.fromJSON({
      amount,
      srcInjectiveAddress: injectiveAddress,
      dstInjectiveAddress: injectiveAddress,
    });

    // Get the PubKey of the Signer from the Wallet/Private Key
    const { offlineSigner } = await getKeplr(chainId);
    const pubKey = await window.keplr.getKey(chainId); // Assuming getPubKey() is defined elsewhere
    console.log("pubKey", pubKey);
    // Prepare the Transaction
    const { txRaw: txRawToSign, signDoc } = createTransaction({
      pubKey,
      chainId,
      fee: DEFAULT_STD_FEE,
      message: [msg], // Assuming msg is the message to be sent
      sequence: baseAccount.sequence,
      timeoutHeight: timeoutHeight.toNumber(),
      accountNumber: baseAccount.accountNumber,
    });

    const directSignResponse = await offlineSigner.signDirect(
      injectiveAddress,
      signDoc
    );
    const txRaw = getTxRawFromTxRawOrDirectSignResponse(directSignResponse); // Assuming this function is defined elsewhere

    const txHash = await broadcastTx(chainId, txRaw);
    const response = await new TxRestClient(restEndpoint).fetchTxPoll(txHash);

    return response;
  }

  // const signMessage = async () => {
  //   console.log("ChainId", ChainId);
  //   const { offlineSigner, accounts, key } = await getKeplrSigner(
  //     ChainId.Testnet
  //   );
  //   const directSignResponse = await offlineSigner.signDirect(testWalletAddr, {
  //     key: "value",
  //   });
  //   console.log("directSignResponse", directSignResponse, accounts);
  // };
  async function connectWallet() {
    const keplr = await getKeplr();
    if (!keplr) return;

    const chainId = "injective-888";

    const offlineSigner = keplr.getOfflineSigner(chainId);
    const accounts = await offlineSigner.getAccounts();
    setPublicAddress(accounts[0].address);
    console.log({ keplr, accounts });
    return { keplr, accounts };
  }
  // // async function sendTransaction(
  // //   senderAddress,
  // //   recipientAddress,
  // //   amount,
  // //   memo
  // // ) {
  // //   try {
  // //     const keplr = await getKeplr();
  // //     if (!keplr) return;

  // //     const chainId = "injective-888";
  // //     const offlineSigner = keplr.getOfflineSigner(chainId);
  // //     const accounts = await offlineSigner.getAccounts();

  // //     const cosmos = new CosmosClient(
  // //       "https://testnet.sentry.tm.injective.network:443",
  // //       chainId
  // //     );

  // //     const msgSend = {
  // //       type: "cosmos-sdk/MsgSend",
  // //       value: {
  // //         from_address: senderAddress,
  // //         to_address: recipientAddress,
  // //         amount: [{ denom: "inj", amount: String(amount) }],
  // //       },
  // //     };

  // //     const fee = {
  // //       amount: [{ denom: "inj", amount: "5000" }],
  // //       gas: "200000",
  // //     };

  // //     const { included } = await cosmos.sendTx({
  // //       msgs: [msgSend],
  // //       fee: fee,
  // //       memo: memo,
  // //     });

  // //     console.log("Transaction included in a block:", included);
  // //   } catch (error) {
  // //     console.error("Error in sendTransaction:", error);
  // //   }
  // // }
  // async function sendTransaction(
  //   senderAddress,
  //   recipientAddress,
  //   amount,
  //   memo
  // ) {
  //   try {
  //     // Ensure Keplr is available
  //     if (!window.keplr) {
  //       alert("Please install Keplr extension");
  //       return;
  //     }

  //     // Enable the Injective testnet
  //     await window.keplr.enable("injective-888");
  //     const chainId = "injective-888";
  //     const offlineSigner = window.keplr.getOfflineSigner(chainId);

  //     // Create a new signing client
  //     const signingClient = await window.injective.getSigningClient({
  //       rpcUrl: "https://testnet.sentry.tm.injective.network:443",
  //       signer: offlineSigner,
  //     });

  //     // Define transaction message
  //     const msg = {
  //       typeUrl: "/cosmos.bank.v1beta1.MsgSend",
  //       value: {
  //         fromAddress: senderAddress,
  //         toAddress: recipientAddress,
  //         amount: [{ denom: "inj", amount: String(amount) }],
  //       },
  //     };

  //     // Define fee
  //     const fee = {
  //       amount: [{ denom: "inj", amount: "5000" }],
  //       gas: "200000",
  //     };

  //     // Broadcast the transaction
  //     const response = await signingClient.sendTx({
  //       chainId: chainId,
  //       msgs: [msg],
  //       memo: memo,
  //       fee: fee,
  //     });

  //     console.log("Transaction response:", response);
  //   } catch (error) {
  //     console.error("Error in sendTransaction:", error);
  //   }
  // }
  // async function connectClient() {
  //   const client = await SigningStargateClient.connect(rpcEndpoint);
  //   // client.broadcastTx();
  //   client.console.log(await client.getChainId());
  // }
  // async function sendTransactionStargate(recipientAddress, amount, memo = "") {
  //   if (!window.keplr) {
  //     alert("Please install Keplr extension");
  //     return;
  //   }

  //   try {
  //     // Suggest/Enable the chain (if not already enabled)
  //     await window.keplr.enable(chainId);

  //     // Get Keplr's offlineSigner for the specific chain
  //     const offlineSigner = window.keplr.getOfflineSigner(chainId);

  //     // Create a Stargate client using Keplr's signer
  //     const client = await SigningStargateClient.connectWithSigner(
  //       rpcEndpoint,
  //       offlineSigner
  //     );
  //     client.signAndBroadcast;
  //     // Get the sender's address from the offline signer
  //     const [firstAccount] = await offlineSigner.getAccounts();
  //     const senderAddress = firstAccount.address;
  //     console.log("client", senderAddress);

  //     // Define the message for sending tokens
  //     const msg = {
  //       typeUrl: "/cosmos.bank.v1beta1.MsgSend",
  //       value: {
  //         fromAddress: senderAddress,
  //         toAddress: recipientAddress,
  //         amount: [{ denom: "uinj", amount: `${amount}` }], // Replace 'INJ' with the token denomination
  //       },
  //     };

  //     // Define fee
  //     const fee = {
  //       amount: [{ denom: "uinj", amount: "500" }], // Replace 'INJ' with the fee denomination
  //       gas: "200000", // Adjust the gas limit according to your needs
  //     };
  //     // console.log(
  //     //   await client.sendTokens(
  //     //     senderAddress,
  //     //     testWalletAddr,
  //     //     [{ denom: "uinj", amount: "1" }],
  //     //     {
  //     //       amount: [{ denom: "uinj", amount: "500" }],
  //     //       gas: "200000",
  //     //     }
  //     //   )
  //     // );
  //     // Broadcast the transaction
  //     const result = await client.signAndBroadcast(
  //       senderAddress,
  //       [msg],
  //       fee,
  //       memo
  //     );
  //     console.log("Transaction result:", result);
  //   } catch (error) {
  //     console.error("Error in sendTransaction:", error);
  //   }
  // }
  // // ! ************************************************************************************************************** METAMASK
  // async function connectMetaMask() {
  //   if (typeof window.ethereum !== "undefined") {
  //     // MetaMask is installed
  //     try {
  //       // Request account access
  //       const accounts = await window.ethereum.request({
  //         method: "eth_requestAccounts",
  //       });
  //       const chainId = await window.ethereum.request({
  //         method: "eth_chainId",
  //       });

  //       // Convert chainId to a decimal number
  //       const numericChainId = parseInt(chainId, 16);
  //       const account = accounts[0];
  //       console.log("Connected account:", account, numericChainId);
  //       setPublicAddress(account);
  //       // console.log(getTransactionHistory(account));
  //       return account; // You can use this account information in your application
  //     } catch (error) {
  //       console.error("User denied account access");
  //     }
  //   } else {
  //     // MetaMask is not installed
  //     alert(
  //       "MetaMask is not installed. Please install it to use this feature."
  //     );
  //   }
  // }
  // async function getTransactionHistory(address) {
  //   // Initialize Web3
  //   const web3 = new Web3(
  //     Web3.givenProvider || "https://sentry.tm.injective.network:443"
  //   );
  //   // Fetch transaction history for the address
  //   // This is a placeholder - you need to use a method compatible with INJ chain
  //   const transactions = await web3.eth.getPastLogs({ address: address });

  //   return transactions;
  // }
  // async function sendTransactionWithMetamask(fromAddress, toAddress, amount) {
  //   if (typeof window.ethereum === "undefined") {
  //     alert("Please install MetaMask!");
  //     return;
  //   }

  //   try {
  //     const web3 = new Web3(window.ethereum);
  //     await window.ethereum.enable();

  //     // Specify the transaction parameters
  //     const tx = {
  //       from: fromAddress,
  //       to: toAddress,
  //       value: web3.utils.toWei(amount, "ether"), // Convert the amount to Wei
  //       gas: 21000, // This is the gas limit for standard transactions
  //     };

  //     // Send the transaction
  //     const txHash = await web3.eth.sendTransaction(tx);
  //     console.log("Transaction Hash:", txHash);
  //   } catch (error) {
  //     console.error("Transaction error:", error);
  //   }
  // }

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

            <button
              className="font-proxima-nova mr-16 flex justify-center rounded-md border-2 border-[#008884] bg-[#008884] py-3 px-6 font-normal text-black hover:border-[#008884] hover:bg-black hover:text-[#008884]"
              onClick={() => {
                // connectClient();
                // sendTransactionStargate(testWalletAddr, 0.001);
                // sendTransaction(publicAddress, testWalletAddr, 0.001, {
                //   key: "value1",
                // });
                // signMessage();

                createAndSignTransaction(
                  testWalletAddr,
                  "injective-888",
                  getNetworkEndpoints(Network.Testnet).rest,
                  { amount: "1", denom: "inj" }
                )
                  .then((response) =>
                    console.log("Transaction Response:", response)
                  )
                  .catch((error) => console.error("Error:", error));
              }}
            >
              Transact
            </button>
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
