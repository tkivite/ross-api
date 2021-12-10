const db = require("../db/models");
const Sequelize = require("sequelize");
const unirest = require("unirest");
const Op = Sequelize.Op;
async function createAccount(request) {
  const requestId = request.requestContext.requestId;
  const { operation, tags, args } = JSON.parse(request.body);
  const dummyEndpoint = "https://nearqueueserver.free.beeceptor.com";
  const endpoint = process.env.CREATE_ACCOUNT_URL || dummyEndpoint;
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
          tags: tags,
          args: args
        })
      )
      .then((response) => {
        console.log(response.body);
      });

    const account = await db.RequestLog.create({
      requestId: requestId,
      operation: operation,
      tags: tags,
      args: args,
      status: "new",
    });

    if (account) {
      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            operation: "create_wallet_out",
            success: true,
            args: {
              new_account_id: "my-account.testnet",
              app_user_hash: "sdfgiunp0ewrgipubsdfg",
            },
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
            operation: "create_wallet_out",
            success: false,
            args: {
              new_account_id: "none",
            },
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
          operation: "create_wallet_out",
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
  createAccount: createAccount,
};
