import Image from "next/image";
import Link from "next/link";
import React from "react";

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
  async function getKeplr() {
    if (!window.keplr) {
      alert("Please install Keplr extension");
      return;
    }

    await window.keplr.enable("injective-888"); // Example: Enable the Cosmos Hub chain
    const keplr = window.keplr;
    return keplr;
  }
  async function connectWallet() {
    const keplr = await getKeplr();
    if (!keplr) return;

    const chainId = "injective-888";

    const offlineSigner = keplr.getOfflineSigner(chainId);
    const accounts = await offlineSigner.getAccounts();
    console.log({ keplr, accounts });
    return { keplr, accounts };
  }
  async function sendTransaction(
    senderAddress,
    recipientAddress,
    amount,
    memo
  ) {
    try {
      const keplr = await getKeplr();
      if (!keplr) return;

      const chainId = "injective-888";
      const offlineSigner = keplr.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();

      const cosmos = new CosmJS.Cosmos(offlineSigner, chainId);

      const msgSend = {
        type: "cosmos-sdk/MsgSend",
        value: {
          from_address: senderAddress,
          to_address: recipientAddress,
          amount: [{ denom: "inj", amount: String(amount) }],
        },
      };

      const fee = {
        amount: [{ denom: "inj", amount: "5000" }],
        gas: "200000",
      };

      const { included } = await cosmos.sendTx({
        msgs: [msgSend],
        fee: fee,
        memo: memo,
      });

      console.log("Transaction included in a block:", included);
    } catch (error) {
      console.error("Error in sendTransaction:", error);
    }
  }

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
        <button
          onClick={connectWallet}
          className="font-proxima-nova mr-16 flex justify-center rounded-md border-2 border-[#008884] bg-[#008884] py-3 px-6 font-normal text-black hover:border-[#008884] hover:bg-black hover:text-[#008884]"
        >
          Connect Wallet
        </button>
      </header>
      <section className="max-w-[95vw] mx-auto">{children}</section>
      <footer></footer>
    </main>
  );
}

export default DashboardLayout;
