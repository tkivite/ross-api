const db = require("../db/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
async function sendNft(request) {
  const requestId = request.requestContext.requestId;
  const { app_user_hash, operation, tags, args } = JSON.parse(request.body);
  
  // Forward request to Queue server

  const dummyEndpoint = "https://nearqueueserver.free.beeceptor.com/nft";
  const endpoint = process.env.TRANSFER_NTF_URL || dummyEndpoint;
  try {    
    unirest
      .post(endpoint)
      .headers({
        Accept: "application/json",
        "Content-Type": "application/json",
      })
      .send(
        JSON.stringify({
          requestId: requestId,
          operation: operation,
          app_user_hash: app_user_hash,
          tags: tags,
          args: args
        })
      )
      .then((response) => {
        console.log(response.body);
      });

    // Log request in database

    const nft = await db.RequestLog.create({
      requestId: requestId,
      appUserHash: app_user_hash,
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
            success: true,
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
            success: false,
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
