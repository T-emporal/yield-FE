import Image from "next/image";
import { Inter } from "next/font/google";
import DashboardLayout from "@/layouts/DashboardLayout";

const inter = Inter({ subsets: ["latin"] });
function SingleTokenCard({ token, tokenYield, gradient, logoSrc }) {
  return (
    <div
      className="transform transition-transform duration-300 hover:scale-105 hover:shadow-lg rounded-xl border-[#ffffff] border-opacity-40 px-8 py-4"
      style={{
        borderWidth: "1px",
        background: gradient,
      }}
    >
      <div className="flex-column justify-between">
        <div className="flex  justify-between">
          <p className="font-helvetica-neue pb-16 text-4xl text-white">
            {token}
          </p>
          <img src={logoSrc} alt="Injective Logo" />
        </div>
        <p className="font-helvetica-neue mt-8 text-sm font-extralight text-white">
          Yield Upto
        </p>
        <p className="font-helvetica-neue text-3xl text-[#0ABAB5]">
          {tokenYield}
        </p>
      </div>
    </div>
  );
}
export default function Home() {
  return (
    <DashboardLayout activePage={"Markets"}>
      <section className="grid grid-cols-3 gap-[67px] mt-[80px]">
        <SingleTokenCard
          gradient={
            "linear-gradient(180deg, rgba(0, 114, 110, 0.20) 0%, rgba(0, 0, 0, 0.00) 100%), rgba(12, 12, 12, 0.45)"
          }
          token="INJ"
          tokenYield="7.35%"
          logoSrc="./logo_injective.svg"
        />
        <SingleTokenCard
          gradient={
            "linear-gradient(180deg, rgba(71, 84, 209, 0.20) 0%, rgba(0, 0, 0, 0.00) 100%), rgba(12, 12, 12, 0.45)"
          }
          token="ATOM"
          tokenYield="4.73%"
          logoSrc="./logo_atom.svg"
        />
        <SingleTokenCard
          gradient={
            "linear-gradient(180deg, rgba(174, 74, 140, 0.20) 0%, rgba(0, 0, 0, 0.00) 100%), rgba(12, 12, 12, 0.45)"
          }
          token="OSMO"
          tokenYield="7.35%"
          logoSrc="./logo_osmo.svg"
        />
        <SingleTokenCard
          gradient={
            "linear-gradient(180deg, rgba(122, 122, 122, 0.20) 0%, rgba(0, 0, 0, 0.00) 100%), rgba(12, 12, 12, 0.45)"
          }
          token="stETH"
          tokenYield="4.56%"
          logoSrc="./logo_stEth.svg"
        />
        <SingleTokenCard
          gradient={
            "linear-gradient(180deg, rgba(0, 114, 110, 0.20) 0%, rgba(0, 0, 0, 0.00) 100%), rgba(12, 12, 12, 0.45)"
          }
          token="USDT"
          tokenYield="3.72%"
          logoSrc="./logo_usdt.svg"
        />
        <SingleTokenCard
          gradient={
            "linear-gradient(180deg, rgba(120, 73, 199, 0.20) 0%, rgba(0, 0, 0, 0.00) 100%), rgba(12, 12, 12, 0.45)"
          }
          token="wMATIC"
          tokenYield="6.84%"
          logoSrc="./logo_matic.svg"
        />
      </section>
    </DashboardLayout>
  );
}
