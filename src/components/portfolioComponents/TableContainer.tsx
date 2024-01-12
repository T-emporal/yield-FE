import { ChevronDownIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from 'react';

import { Network, getNetworkEndpoints } from "@injectivelabs/networks";
import { ChainGrpcWasmApi, IndexerGrpcOracleApi } from "@injectivelabs/sdk-ts";
import { WalletStrategy } from '@injectivelabs/wallet-ts'
import { Web3Exception } from '@injectivelabs/exceptions'
import { ChainId } from "@injectivelabs/ts-types";

import { TableContainerProps } from '@/types/Components';

// ------------------------------Old Implementation------------------------------


// const TableContainer = ({ data, title }: TableContainerProps) => {

//   async function queryContractPool() {
//     try {

//       //======================================================
//       // Wallet Strategy setup for account address
//       //======================================================

//       const walletStrategy = new WalletStrategy({
//         chainId: ChainId.Testnet,
//       })

//       const getAddresses = async (): Promise<string[]> => {
//         const addresses = await walletStrategy.getAddresses();

//         if (addresses.length === 0) {
//           throw new Web3Exception(
//             new Error("There are no addresses linked in this wallet.")
//           );
//         }

//         return addresses;
//       };

//       const [address] = await getAddresses();
//       const injectiveAddress = address
//       //======================================================

//       const NETWORK = Network.TestnetSentry;
//       const ENDPOINTS = getNetworkEndpoints(NETWORK);
//       const chainGrpcWasmApi = new ChainGrpcWasmApi(ENDPOINTS.grpc);

//       const contractAddress = "inj10k852590ktkn5k9jw5gjgktmleawqdaes63qda";

//       if (!contractAddress) {
//         throw new Error("Contract address is required.");
//       }

//       // const queryObj = { lend_to_pool: {address: injectiveAddress} };
//       const queryObj = { pool: {} };
//       const json = JSON.stringify(queryObj);
//       const b64Query = Buffer.from(json).toString('base64');

//       // const contractInfo = await chainGrpcWasmApi.fetchContractInfo(contractAddress)
//       // console.log("contractInfo", contractInfo);

//       const contractState = await chainGrpcWasmApi.fetchSmartContractState(contractAddress, b64Query);
//       console.log("contractState", contractState);

//       return contractState;
//     } catch (error) {
//       console.error("An error occurred while querying the contract pool:", error);
//       // throw error; 
//     }
//   }

//   // CMNT: Disabled for now

//   // useEffect(() => {
//   //   queryContractPool();
//   // }, []);

//   return (
//     <div className="p-4 xl:p-6 flex flex-col items-start  border border-[#395251ee] mb-3 xl:mb-4  rounded-xl bg-gray-700/20 backdrop-blur-[4px]">
//       <div className="w-full flex items-center justify-between">
//         <span className="text-[#f2f2f2] font-semibold uppercase text-lg block mb-3 xl:mb-4">
//           {title}
//         </span>
//         <p className="flex items-center text-white">
//           <span className="text-sm font-light px-1">CURRENCY:</span>
//           <span className="text-sm font-medium px-1">USD, ASSET A</span>
//           <ChevronDownIcon width={16} />
//         </p>
//       </div>
//       <table className="min-w-full ">
//         <thead className="bg-gray-950/40">
//           <tr>
//             {Object.keys(data[0]).map((singleHeader) => (
//               <th
//                 key={singleHeader}
//                 scope="col"
//                 className="py-3 xl:py-3.5 pl-4 pr-3 text-left text-xs xl:text-sm font-semibold text-[#f2f2f2] uppercase"
//               >
//                 {singleHeader}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody className="bg-transparent">
//           {data.map((asset, rowIndex) => (
//             <tr key={rowIndex}>
//               {Object.values(asset).map((singleValue, colIndex) => {
//                 const key = `row-${rowIndex}_col-${colIndex}`;
//                 return (
//                   <td
//                     key={key}
//                     scope="col"
//                     className="whitespace-nowrap px-3 py-2 xl:py-3 text-xs xl:text-sm text-[#f2f2f2] pl-5"
//                   >
//                     {typeof singleValue === 'string' || typeof singleValue === 'number' ? singleValue : React.cloneElement(singleValue, { key: key })}
//                   </td>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>

//       </table>
//     </div>
//   );
// }

// ------------------------------Old Implementation------------------------------


// Assuming the chains array is defined outside or imported
const chains = [
  { name: "stINJ", icon: "./logo_injective.svg" },
  { name: "stATOM", icon: "./logo_atom.svg" },
  { name: "stOSMO", icon: "./logo_osmo.svg" },
  { name: "stETH", icon: "./logo_stEth.svg" },
  { name: "stUSDT", icon: "./logo_usdt.svg" },
  { name: "stMATIC", icon: "./logo_matic.svg" },
];

interface Prices {
  [key: string]: number | undefined;
}

interface RowDataObject {
  [key: string]: string;
}

const TableContainer = ({ data, title }: TableContainerProps) => {

  const [prices, setPrices] = useState<Prices>({}); // Define the type of the prices state

  const headings = ["Asset", "Duration", "Maturity", "APY", "Units", "Value", "Liquidate"];
  const uniqueChains = Array.from(new Set(data.map(row => row[0])));

  useEffect(() => {
    const fetchPrices = async () => {
      let newPrices: { [key: string]: number } = {};

      for (const chain of uniqueChains) {
        const price = await getOraclePrice(chain);
        newPrices[chain] = price;
      }

      setPrices(newPrices);
    };

    fetchPrices();
  }, []);

  const calculateValue = (chain: string, quantity: number): string => {
    const price = prices[chain];
    if (typeof price === 'number') {
      return (price * quantity).toFixed(2);
    } else {
      return 'Loading...';
    }
  };

  const getAssetIcon = (assetName: string): string | undefined => {
    const chain = chains.find(chain => chain.name === assetName);
    return chain ? chain.icon : undefined;
};

  // async function getOraclePrice(baseSymbol) {
  //   const endpoints = getNetworkEndpoints(Network.Mainnet);
  //   const indexerGrpcOracleApi = new IndexerGrpcOracleApi(endpoints.indexer);

  //   const quoteSymbol = "USDT";
  //   const oracleType = "bandibc"; // primary oracle we use

  //   const oraclePrice = await indexerGrpcOracleApi.fetchOraclePriceNoThrow({
  //     baseSymbol,
  //     quoteSymbol,
  //     oracleType,
  //   });

  //   console.log("oraclePrice for "+ baseSymbol + "is: " + oraclePrice.price);
  //   return oraclePrice.price;
  // }

  async function getOraclePrice(baseSymbol = "INJ") {

    return 10;
  }

  const handleButtonClick = (rowData: string[]) => {
    console.log("Row Data:", rowData);
  };

  const handleButtonClickObj = (rowData: string[]) => {
    const rowDataObject = headings.reduce<RowDataObject>((obj, heading, index) => {
      if (heading === "Value") {
        const chain = rowData[0];
        const quantity = parseFloat(rowData[4]);
        const price = prices[chain];
        const value = (typeof price === 'number') ? (price * quantity).toFixed(2) : 'Not Available';
        obj[heading] = value;
      } else {
        obj[heading] = rowData[index];
      }
      return obj;
    }, {});

    console.log("Row Data Object:", rowDataObject);
  };

  return (
    <div className="p-4 xl:p-6 flex flex-col items-start border border-[#395251ee] mb-3 xl:mb-4 rounded-xl bg-gray-700/20 backdrop-blur-[4px]">
      <div className="w-full flex items-center justify-between">
        <span className="text-[#f2f2f2] font-semibold uppercase text-lg block mb-3 xl:mb-4">
          {title}
        </span>
        {/* Additional elements like currency selector can be added here */}
      </div>
      <table className="min-w-full">
        <thead className="bg-gray-950/40">
          <tr>
            {headings.map((heading) => (
              <th
                key={heading}
                className="py-3 xl:py-3.5 pl-4 pr-3 text-left text-xs xl:text-sm font-semibold text-[#f2f2f2] uppercase"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-transparent">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => {
                const key = `row-${rowIndex}_col-${cellIndex}`;
                if (cellIndex === 0) { // Asset column with icon
                  return (
                    <td key={key} className="whitespace-nowrap px-3 py-2 xl:py-3 text-xs xl:text-sm text-[#f2f2f2] pl-5">
                      <span className="flex items-center">
                        <img src={getAssetIcon(cell)} alt="" className="w-4 h-4 mr-2" />
                        {cell}
                      </span>
                    </td>
                  );
                } else if (cellIndex === headings.length - 2) { // Value column
                  return (
                    <td key={key} className="whitespace-nowrap px-3 py-2 xl:py-3 text-xs xl:text-sm text-[#f2f2f2] pl-5">
                      {calculateValue(row[0], parseFloat(row[4]))}
                    </td>
                  );
                } else if (cellIndex === headings.length - 1) {
                  return (
                    <td key={`row-${rowIndex}_col-${cellIndex}`} className="...">
                      <button onClick={() => handleButtonClickObj(row)} className="text-blue-500 px-3 hover:text-blue-800">
                        Liquidate
                      </button>
                    </td>
                  );
                } else { // Other columns
                  return (
                    <td key={key} className="whitespace-nowrap px-3 py-2 xl:py-3 text-xs xl:text-sm text-[#f2f2f2] pl-5">
                      {cell}
                    </td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableContainer;