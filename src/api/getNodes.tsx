const { default: axios } = require("axios");

export function getNodes() {
  return axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/nodes`);
}
