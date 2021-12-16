"use strict";
require("dotenv").config({
  path: "./setup.env",
});
//const requestService = require("./server/services/request");
const callbackService = require("./server/services/callback");

// module.exports.fetchRequest = async (event) => {
//   return await requestService.fetchRequest(event);
// };
module.exports.callback = async (event) => {
  return await callbackService.response(event);
};
