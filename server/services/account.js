const unirest = require("unirest");
const nearAPI = require("near-api-js");
async function createAccount(request) {
  const requestId = request.requestContext.requestId;
  try {
    let body = JSON.parse(request.body);

    // request validations
    let missingParamsArray = missingParams(body);
    if (missingParamsArray.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify(
          {
            success: false,
            message: "Missing Parameters: " + missingParamsArray.join(" "),
          },
          null,
          2
        ),
      };
    }
    const { operation, tags, args } = body;
    let missingtagsArray = missingTags(tags);
    if (missingtagsArray.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify(
          {
            success: false,
            message: "Missing Tags: " + missingtagsArray.join(" "),
          },
          null,
          2
        ),
      };
    }
    let transaction_id = tags.transaction_id;
    let missingArgsArray = missingArgs(args);
    if (missingArgsArray.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify(
          {
            success: false,
            message: "Missing Args: " + missingArgsArray.join(", "),
          },
          null,
          2
        ),
      };
    }

    //validate account wallet name
    //has valid suffix
    if (!correctSuffix(args.new_account_id)) {
      return {
        statusCode: 400,
        body: JSON.stringify(
          {
            success: false,
            message: "Error, does not end with .near or .testnet",
          },
          null,
          2
        ),
      };
    }

    let i = args.new_account_id.lastIndexOf(".");
    let name = args.new_account_id.substring(0, i);
    let suffix = args.new_account_id.substring(i);

    if (!correctSuffix(args.new_account_id)) {
      return {
        statusCode: 400,
        body: JSON.stringify(
          {
            success: false,
            message: "Error, does not end with .near or .testnet",
          },
          null,
          2
        ),
      };
    }

    //
    //Error, does not end with .near or .testnet
    args.new_account_id = validWalletName(name) + suffix;
    if (!nameLengthIsOk(name)) {
      return {
        statusCode: 400,
        body: JSON.stringify(
          {
            success: false,
            message: "wallet name too short/long",
          },
          null,
          2
        ),
      };
    }

    // const walletNameTaken = await walletNameIsTaken(args.new_account_id);
    // if (walletNameTaken) {
    //   return {
    //     statusCode: 400,
    //     body: JSON.stringify(
    //       {
    //         success: false,
    //         message: "wallet name taken",
    //       },
    //       null,
    //       2
    //     ),
    //   };
    // }
    const endpoint = process.env.QUEUE_SERVER_URL;

    // send request to queue server

    const queueserver_response = await unirest
      .post(endpoint)
      .headers({
        Accept: "application/json",
        "Content-Type": "application/json",
      })
      .send(
        JSON.stringify({
          id: requestId,
          operation: operation,
          tags: tags,
          args: args,
        })
      );
    if (queueserver_response) {
      console.log(queueserver_response.body);
      let { message, code } = queueserver_response.body;
      if (code == 0) {
        return {
          statusCode: 200,
          body: JSON.stringify(
            {
              id: requestId,
              transaction_id: transaction_id,
              account: args.new_account_id,
              success: true,
              message: "Message received",
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
              success: false,
              message: "Problems sending message",
            },
            null,
            2
          ),
        };
      }
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          success: false,
          error: err.message,
        },
        null,
        2
      ),
    };
  }
}
async function checkName(request) {
  const requestId = request.requestContext.requestId;
  try {
    let body = JSON.parse(request.body);
    let { wallet_name } = body;

    //validate account wallet name
    //has valid suffix
    if (!correctSuffix(wallet_name)) {
      return {
        statusCode: 400,
        body: JSON.stringify(
          {
            success: false,
            message: "Error, does not end with .near or .testnet",
          },
          null,
          2
        ),
      };
    }

    let i = wallet_name.lastIndexOf(".");
    let name = wallet_name.substring(0, i);
    let suffix = wallet_name.substring(i);

    //
    //Error, does not end with .near or .testnet
    wallet_name = validWalletName(name) + suffix;
    if (!nameLengthIsOk(name)) {
      return {
        statusCode: 400,
        body: JSON.stringify(
          {
            success: false,
            message: "wallet name too short/long",
          },
          null,
          2
        ),
      };
    }

    const walletNameTaken = await walletNameIsTaken(wallet_name);
    if (walletNameTaken) {
      return {
        statusCode: 400,
        body: JSON.stringify(
          {
            success: false,
            message: "wallet name taken",
          },
          null,
          2
        ),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          success: true,
          wallet_name: wallet_name,
        },
        null,
        2
      ),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          success: false,
          error: err.message,
        },
        null,
        2
      ),
    };
  }
}

function missingParams(bodyParams) {
  let arrayDiff = ["operation", "tags", "args"].filter(
    (a) => !Object.keys(bodyParams).includes(a)
  );
  //  console.log(arrayDiff);
  return arrayDiff;
}

function missingTags(tagObject) {
  let arrayDiff = ["app_id", "action_id", "user_id", "transaction_id"].filter(
    (a) => !Object.keys(tagObject).includes(a)
  );
  return arrayDiff;
}

function missingArgs(argObject) {
  let arrayDiff = ["new_account_id", "email", "phone"].filter(
    (a) => !Object.keys(argObject).includes(a)
  );
  // check if either email or phone exits
  arrayDiff =
    arrayDiff.length == 1 &&
    (arrayDiff[0] == "phone" || arrayDiff[0] == "email")
      ? []
      : arrayDiff;
  return arrayDiff;
}

async function walletNameIsTaken(name) {
  //return false;
  const { connect } = nearAPI;

  const config = {
    networkId: "mainnet",
    keyStore: "123", // optional if not signing transactions
    nodeUrl: "https://rpc.mainnet.near.org",
    walletUrl: "https://wallet.mainnet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
    explorerUrl: "https://explorer.mainnet.near.org",
  };
  const near = await connect(config);
  // test if account exists
  try {
    const senderAccount = await near.account(name);
    const userExists = !!(await senderAccount.state());
    if (userExists) return true;
    else return false;
  } catch (e) {
    return false;
  }

  //return
}

function correctSuffix(name) {
  return name.endsWith(".testnet") || name.endsWith(".near");
}

function validWalletName(name) {
  return name
    .toLowerCase()
    .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
  //allowed regEX
  // /^(([a-z\d]+[\-_])*[a-z\d]+\.)*([a-z\d]+[\-_])*[a-z\d]+$/.test(name)
}
function nameLengthIsOk(name) {
  return name.length > 2 && name.length < 56;
}
module.exports = {
  createAccount: createAccount,
  checkName: checkName,
};
