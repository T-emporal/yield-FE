import { ChevronDownIcon } from "@heroicons/react/24/outline";
import React, { useEffect } from 'react';

import { Network, getNetworkEndpoints } from "@injectivelabs/networks";
import { ChainGrpcWasmApi } from "@injectivelabs/sdk-ts";
import { WalletStrategy } from '@injectivelabs/wallet-ts'
import { Web3Exception } from '@injectivelabs/exceptions'
import { ChainId } from "@injectivelabs/ts-types";

import { TableContainerProps } from '@/types/Components';


const TableContainer = ({ data, title }: TableContainerProps) => {

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

      const [address] = await getAddresses();
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

  // CMNT: Disabled for now

  // useEffect(() => {
  //   queryContractPool();
  // }, []);

  return (
    <div className="p-4 xl:p-6 flex flex-col items-start  border border-[#395251ee] mb-3 xl:mb-4  rounded-xl bg-gray-700/20 backdrop-blur-[4px]">
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
      <table className="min-w-full ">
        <thead className="bg-gray-950/40">
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
          {data.map((asset, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(asset).map((singleValue, colIndex) => {
                const key = `row-${rowIndex}_col-${colIndex}`;
                return (
                  <td
                    key={key}
                    scope="col"
                    className="whitespace-nowrap px-3 py-2 xl:py-3 text-xs xl:text-sm text-[#f2f2f2] pl-5"
                  >
                    {typeof singleValue === 'string' || typeof singleValue === 'number' ? singleValue : React.cloneElement(singleValue, { key: key })}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default TableContainer;
