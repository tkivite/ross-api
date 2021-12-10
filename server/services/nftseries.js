const db = require("../db/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
async function createNftSeries(request) {
  const requestId = request.requestContext.requestId;
  const { app_user_hash, operation, tags, args } = JSON.parse(request.body);
  try {
    const nftseries = await db.RequestLog.create({
      requestId: requestId,
      appUserHash: app_user_hash,
      operation: operation,
      tags: tags,
      args: args,
      status: "new",
    });

    if (nftseries) {
      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            operation: "create_nft_series_out",
            success: true,
            args: {
              token_id: 1234,
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
            operation: "create_nft_series_out",
            success: false,
            args: {
              token_id: "none",
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
          operation: "create_nft_series_out",
          success: false,
          error: err,
        },
        null,
        2
      ),
    };
  }
}

async function viewNextNftInSeries(request) {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        operation: "create_nft_series_out",
        success: true,
        args: {
          token_id: 1234,
        },
      },
      null,
      2
    ),
  };
}

async function claimtNftInSeries(request) {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Success",
        total_minted: 125,
        total_allowed: 125,
        near_explorer_transaction_url: "",
        hash: "",
      },
      null,
      2
    ),
  };
}

module.exports = {
  createNftSeries: createNftSeries,
  viewNextNftInSeries: viewNextNftInSeries,
  claimtNftInSeries: claimtNftInSeries,
};
