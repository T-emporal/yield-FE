import Image from "next/image";
import { Inter } from "next/font/google";
import DashboardLayout from "@/layouts/DashboardLayout";

const inter = Inter({ subsets: ["latin"] });
function SingleTokenCard({ token, tokenYield, gradient, logoSrc }) {
  return (
    <div
      className="transform transition-transform duration-300 hover:scale-105 hover:shadow-lg rounded-xl border-[#ffffff] border-opacity-20 px-8 py-4"
      style={{
        borderWidth: "1px",
        background: gradient,
      }}
    >
      <div className="flex-column justify-between">
        <div className="flex justify-between">
          <p className="font-helvetica-neue pb-16 text-4xl text-[#f2f2f2]">
            {token}
          </p>
          <img src={logoSrc} alt="Injective Logo" />
        </div>
        <p className="font-helvetica-neue mt-8 text-xs font-extralight flex items-end text-gray-300">
          Your Yield
        </p>
        <div className="font-helvetica-neue text-4xl text-[#0ABAB5] flex items-end justify-between">
          <span>{tokenYield}</span>
          <div className="text-[#f2f2f2] text-xs flex items-end">
            <span className="border-r border-temporal px-4 ">Yield</span>
            <span className="border-r border-temporal px-4 ">Principal</span>
            <span className="pl-4">Earn</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function Home() {

  return (
    <DashboardLayout activePage={"Markets"}>
      <section className="grid grid-cols-3 gap-[67px] mt-[80px] mx-auto max-w-[1280px]">
        <SingleTokenCard
          gradient={
            "linear-gradient(180deg, rgba(0, 40, 29, 0.25)  0%, rgba(0, 0, 0, 0.00) 100%), rgba(0, 0, 0, 0.3)"
          }
          token="INJ"
          tokenYield="7.35%"
          logoSrc="./logo_injective.svg"
        />
        <SingleTokenCard
          gradient={
            "linear-gradient(180deg, rgba(41, 49, 125, 0.25)  0%, rgba(0, 0, 0, 0.00) 100%), rgba(0, 0, 0, 0.3)"
          }
          token="ATOM"
          tokenYield="4.73%"
          logoSrc="./logo_atom.svg"
        />
        <SingleTokenCard
          gradient={
            "linear-gradient(180deg, rgba(87, 37, 70, 0.25) 0%, rgba(0, 0, 0, 0.00) 100%), rgba(0, 0, 0, 0.3)"
          }
          token="OSMO"
          tokenYield="7.35%"
          logoSrc="./logo_osmo.svg"
        />
        <SingleTokenCard
          gradient={
            "linear-gradient(180deg, rgba(61, 61, 61, 0.25) 0%, rgba(0, 0, 0, 0.00) 100%), rgba(0, 0, 0, 0.3)"
          }
          token="stETH"
          tokenYield="4.56%"
          logoSrc="./logo_stEth.svg"
        />
        <SingleTokenCard
          gradient={
            "linear-gradient(180deg, rgba(0, 40, 29, 0.25) 0%, rgba(0, 0, 0, 0.00) 100%), rgba(0, 0, 0, 0.3)"
          }
          token="USDT"
          tokenYield="3.72%"
          logoSrc="./logo_usdt.svg"
        />
        <SingleTokenCard
          gradient={
            "linear-gradient(180deg, rgba(120, 43, 199, 0.1)  20%, rgba(0, 0, 0, 0.00) 100%), rgba(0, 0, 0, 0.3)"
          }
          token="wMATIC"
          tokenYield="6.84%"
          logoSrc="./logo_matic.svg"
        />
      </section>
    </DashboardLayout>
  );
}
