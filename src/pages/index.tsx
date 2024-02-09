import Image from "next/image";
import Link from "next/link";

import { Inter } from "next/font/google";
import DashboardLayout from "@/layouts/DashboardLayout";

interface SingleTokenCardProps {
  token: string;
  tokenYield: string;
  gradient: string;
  logoSrc: string;
}

const inter = Inter({ subsets: ["latin"] });
const SingleTokenCard = ({ token, tokenYield, gradient, logoSrc }: SingleTokenCardProps) => {
  return (
    <Link href={`/trade?tab=trade&token=${"st" + token}`} passHref>
      <div
        className="transform transition-transform duration-300 hover:scale-105 hover:shadow-lg rounded-xl border-[#ffffff] border-opacity-20 px-8 py-4 cursor-pointer"
        style={{
          borderWidth: "1px",
          background: gradient,
        }}
        onClick={(e) => {
          // Prevents the link action when clicking on inner links
          e.stopPropagation();
        }}
      >
        <div className="flex flex-col justify-between">
          <div className="flex justify-between">
            <p className="font-helvetica-neue pb-16 text-4xl text-[#f2f2f2]">
              {token}
            </p>
            <Image src={logoSrc} alt="Logo" width={100} height={100} />
          </div>
          <p className="font-helvetica-neue mt-8 text-xs font-extralight flex items-end text-gray-300">
            Yield Upto
          </p>
          <div className="font-helvetica-neue text-4xl text-[#0ABAB5] flex items-end justify-between">
            <span>{tokenYield}</span>
            <div className="text-[#f2f2f2] text-sm flex items-end">
              <Link href={`/trade?tab=trade&token=${"st" + token}`} passHref>
                <span className="border-r border-temporal px-4 cursor-pointer" onClick={(e) => e.stopPropagation()}>Trade</span>
              </Link>
              <Link href={`/trade?tab=mint&token=${"st" + token}`} passHref>
                <span className="pl-4" onClick={(e) => e.stopPropagation()}>Mint</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Link>
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
          token="ETH"
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
          token="MATIC"
          tokenYield="6.84%"
          logoSrc="./logo_matic.svg"
        />
      </section>
    </DashboardLayout>
  );
}
