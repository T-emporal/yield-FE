const { default: axios } = require("axios");

// CMNT: Check the data type
export function getDurationYield(duration:any) {
  return axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/node/duration/${duration}`
  );
}
