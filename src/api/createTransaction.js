import axios from "axios";

export function createTransaction(data) {
  return axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/transaction`,
    data
  );
}
