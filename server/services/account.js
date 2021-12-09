const db = require("../db/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
async function createAccount(request) {
  const { operation, tags, args } = JSON.parse(request.body);
  try {
    const account = await db.RequestLog.create({
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
