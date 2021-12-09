const db = require("../db/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
async function sendNft(request) {
  console.log(request);
  const { operation, tags, args } = JSON.parse(request.body);
  try {
    const nft = await db.RequestLog.create({
      operation: operation,
      tags: tags,
      args: args,
      status: "new",
    });

    if (nft) {
      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            operation: "transfer_nft_out",
            success: true
          },
          null,
          2
        ),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify(
          {
            operation: "transfer_nft_out",
            success: false
          },
          null,
          2
        ),
      };
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          operation: "transfer_nft_out",
          success: false,
          error: err,
        },
        null,
        2
      ),
    };
  }
}

module.exports = {
  sendNft: sendNft,
};
