const { default: axios } = require("axios");

export function getDurationYield(duration) {
  return axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/node/duration/${duration}`
  );
}
