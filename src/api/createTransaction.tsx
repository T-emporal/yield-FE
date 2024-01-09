import axios from "axios";

// CMNT: Check the data type
export function createTransaction(data:any) {
  return axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/transaction`,
    data
  );
}
