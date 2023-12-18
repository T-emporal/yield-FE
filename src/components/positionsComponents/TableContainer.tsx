import { ChevronDownIcon } from "@heroicons/react/24/outline";
import React, { useEffect } from 'react';

import { Network, getNetworkEndpoints } from "@injectivelabs/networks";
import { ChainGrpcWasmApi} from "@injectivelabs/sdk-ts";
import { WalletStrategy } from '@injectivelabs/wallet-ts'
import { Web3Exception } from '@injectivelabs/exceptions'
import { ChainId } from "@injectivelabs/ts-types";

function TableContainer({ data, title }) {

async function queryContractPool() {
  try {

    //======================================================
    // Wallet Strategy setup for account address
    //======================================================

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

    const [address]  = await getAddresses();
    const injectiveAddress = address
    //======================================================

      const NETWORK = Network.TestnetSentry;
      const ENDPOINTS = getNetworkEndpoints(NETWORK);
      const chainGrpcWasmApi = new ChainGrpcWasmApi(ENDPOINTS.grpc);

      const contractAddress = "inj10k852590ktkn5k9jw5gjgktmleawqdaes63qda"; 

      if (!contractAddress) {
          throw new Error("Contract address is required.");
      }

      // const queryObj = { lend_to_pool: {address: injectiveAddress} };
      const queryObj = { pool: {} };
      const json = JSON.stringify(queryObj);
      const b64Query = Buffer.from(json).toString('base64');

      // const contractInfo = await chainGrpcWasmApi.fetchContractInfo(contractAddress)
      // console.log("contractInfo", contractInfo);

      const contractState = await chainGrpcWasmApi.fetchSmartContractState(contractAddress, b64Query);
      console.log("contractState", contractState);

      return contractState;
  } catch (error) {
      console.error("An error occurred while querying the contract pool:", error);
      // throw error; 
  }
}

useEffect(() => {
  queryContractPool();
}, []); 

  return (
    <div
      className="p-4 xl:p-6 flex flex-col items-start  border border-[#395251ee] mb-3 xl:mb-4 rounded-[4px] backdrop-blur-[2px]"
      style={{
        background:
          "radial-gradient(44.09% 44.09% at 50% 50%, rgba(20, 32, 36, 0.75) 0%, rgba(21, 24, 29, 0.75) 100%)",
      }}
    >
      <div className="w-full flex items-center justify-between">
        <span className="text-[#f2f2f2] font-semibold uppercase text-lg block mb-3 xl:mb-4">
          {title}
        </span>
        <p className="flex items-center text-white">
          <span className="text-sm font-light px-1">CURRENCY:</span>
          <span className="text-sm font-medium px-1">USD, ASSET A</span>
          <ChevronDownIcon width={16} />
        </p>
      </div>
      <table className="min-w-full  ">
        <thead className="bg-black">
          <tr>
            {Object.keys(data[0]).map((singleHeader) => (
              <th
                key={singleHeader}
                scope="col"
                className="py-3 xl:py-3.5 pl-4 pr-3 text-left text-xs xl:text-sm font-semibold text-[#f2f2f2] uppercase"
              >
                {singleHeader}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-transparent">
          {data.map((person, index) => (
            <tr key={index} className="">
              {Object.values(person).map((singleValue) => (
                <td
                  key={singleValue}
                  scope="col"
                  className="whitespace-nowrap px-3 py-3 xl:py-4 text-xs xl:text-sm text-[#f2f2f2] pl-5"
                >
                  {singleValue}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableContainer;
