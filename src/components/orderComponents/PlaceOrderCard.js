import { Fragment, useState } from "react";
import {
  ArrowSmallLeftIcon,
  ArrowSmallRightIcon,
  ArrowsPointingOutIcon,
  CheckIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Listbox, Transition } from "@headlessui/react";
const tabs = [
  { name: "Borrow", href: "#", current: false },
  { name: "Lend", href: "#", current: false },
  { name: "Earn", href: "#", current: true },
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
const PlaceOrderCard = ({ handleClick, yieldGraphOpen }) => {
  const [collateral, setCollateral] = useState("Select Asset");
  const [quantity, setQuantity] = useState(10);
  const [duration, setDuration] = useState(10);
  const [currentMode, setCurrentMode] = useState("Borrow");
  const [collateralLevel, setCollateralLevel] = useState(220);
  const [selectedChain, setSelectedChain] = useState(chains[0]);
  const [selectedChainCollateral, setSelectedChainCollateral] = useState(
    chains[0]
  );

  return (
    <div className="bg-[#15191db6]  py-6 rounded-md w-full flex flex-col justify-between h-full">
      <div>
        {" "}
        <div className="flex items-center justify-between mb-2 px-6">
          <span className="text-xl font-bold text-white uppercase">
            Place Order
          </span>
          <span
            className="-rotate-45 flex items-center cursor-pointer"
            onClick={handleClick}
          >
            {!yieldGraphOpen ? (
              <ArrowsPointingOutIcon
                strokeWidth={1.5}
                className="w-5 h-5 text-white rotate-45"
              />
            ) : (
              <>
                <ArrowSmallRightIcon
                  strokeWidth={3}
                  className="w-3 h-3 text-white"
                />
                <ArrowSmallLeftIcon
                  strokeWidth={3}
                  className="w-3 h-3 text-white"
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
                }}
                className={classNames(
                  tab.name == currentMode
                    ? "border-temporal text-temporal"
                    : "border-transparent text-white hover:border-gray-300 ",
                  "whitespace-nowrap border-b-2 py-2 px-1 text-xl block w-full text-center font-light uppercase cursor-pointer"
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
          className="my-4"
        >
          <div className="relative my-4">
            <Listbox.Button className="relative w-[150px] left-[50%] -translate-x-[50%] cursor-default rounded-lg  py-2 pl-3 pr-10 text-left  ">
              <span className=" truncate flex items-center text-white">
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
                      `relative text-white cursor-default select-none py-2  px-4 ${
                        active ? "bg-gray-700 text-white" : "text-white"
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
          className={`flex items-center space-x-4 w-full px-16 ${
            currentMode !== "Borrow" ? "mb-4" : ""
          }`}
        >
          <div className="w-full">
            <label
              htmlFor="price"
              className="block text-sm font-medium leading-6 text-gray-100"
            >
              Quantity
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <input
                type="text"
                name="price"
                id="price"
                className="block w-full bg-transparent rounded-[3px] border-0 py-2 pl-7 pr-12 text-white ring-1 ring-inset ring-temporal50 placeholder:text-gray-200 focus:ring-temporal "
                placeholder="0.00"
                aria-describedby="price-currency"
              />
            </div>
          </div>
          <div className="w-full">
            <label
              htmlFor="price"
              className="block text-sm font-medium leading-6 text-gray-100"
            >
              Duration
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <input
                type="text"
                name="price"
                id="price"
                className="block w-full bg-transparent rounded-[3px] border-0 py-2 pl-7 pr-12 text-white ring-1 ring-inset ring-temporal50 placeholder:text-gray-200 focus:ring-temporal "
                placeholder="0.00"
                aria-describedby="price-currency"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-white sm:text-sm" id="price-currency">
                  Days
                </span>
              </div>
            </div>
          </div>
        </div>
        {currentMode == "Borrow" && (
          <div className="px-16">
            <label
              htmlFor="price"
              className="block text-sm font-medium leading-6 text-gray-100 mt-4"
            >
              Collateral Assets
            </label>
            <Listbox
              value={selectedChainCollateral}
              onChange={setSelectedChainCollateral}
              className="mb-4 mt-2"
            >
              <div className="relative my-4">
                <Listbox.Button className="relative  border border-temporal50 w-full cursor-default rounded-lg  py-2 pl-3 pr-10 text-left  ">
                  <span className=" truncate flex items-center text-white">
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
                          `relative text-white cursor-default select-none py-2  px-4 ${
                            active ? "bg-gray-700 text-white" : "text-white"
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
              className="block text-sm font-medium leading-6 text-gray-100 mt-4 mb-3"
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
                className="w-full"
              />
            </div>
          </div>
        )}
        <div className="mb-4 bg-[#036B681A] border border-temporal50 py-2 px-4 mx-16 rounded-[3px]">
          <div className="text-white text-sm">Estimated Yield:</div>
          <div className="text-temporal text-xl">{collateralLevel}%</div>
        </div>
      </div>
      <button className="w-[350px] mx-auto mt-2 py-2 bg-temporal text-black rounded-[4px]">
        ORDER
      </button>
    </div>
  );
};

export default PlaceOrderCard;
