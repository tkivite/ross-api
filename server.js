"use strict";
require("dotenv").config({
  path: "./setup.env",
});
const accountService = require("./server/services/account");
const nftSeriesService = require("./server/services/nftseries");
const nftService = require("./server/services/nft");
const logService = require("./server/services/log");
//const authService = require("./server/services/auth");

module.exports.createAccount = async (event) => {
  return await accountService.createAccount(event);
};
module.exports.createNftSeries = async (event) => {
  return await nftSeriesService.createNftSeries(event);
};
module.exports.viewNextNftInSeries = async (event) => {
  return await nftSeriesService.viewNextNftInSeries(event);
};
module.exports.claimtNftInSeries = async (event) => {
  return await nftSeriesService.claimtNftInSeries(event);
};
module.exports.sendNft = async (event) => {
  return await nftService.sendNft(event);
};
module.exports.sendLog = async (event) => {
  return await logService.sendLog(event);
};
