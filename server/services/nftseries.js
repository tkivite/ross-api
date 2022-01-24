const unirest = require("unirest");
async function createNftSeries(request) {
  const requestId = request.requestContext.requestId;
  try {
    let body = JSON.parse(request.body);

    let missingParamsArray = missingParams(body);
    if (missingParamsArray.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify(
          {
            success: false,
            message: "Missing Parameters: " + missingParamsArray.join(", "),
          },
          null,
          2
        ),
      };
    }
    const { app_user_hash, operation, tags, args } = body;
    let missingtagsArray = missingTags(tags);
    if (missingtagsArray.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify(
          {
            success: false,
            message: "Missing Tags: " + missingtagsArray.join(", "),
          },
          null,
          2
        ),
      };
    }

    let transaction_id = tags.transaction_id;
    let missingArgsArray = missingCreateArgs(args);
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
    let missingMetdata = missingMetaDataArgs(args.token_metadata);
    if (missingMetdata.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify(
          {
            success: false,
            message: "Missing Token Metadata: " + missingMetdata.join(", "),
          },
          null,
          2
        ),
      };
    }

    const endpoint = process.env.QUEUE_SERVER_URL;

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
          app_user_hash: app_user_hash,
          tags: tags,
          args: args,
        })
      );
    if (queueserver_response) {
      //console.log(queueserver_response);
      let { message, code } = queueserver_response.body;
      // db.RequestLog.create({
      //   requestId: requestId,
      //   appUserHash: app_user_hash,
      //   operation: operation,
      //   tags: tags,
      //   args: args,
      //   status: code,
      // });
      if (code == 0) {
        return {
          statusCode: 200,
          body: JSON.stringify(
            {
              id: requestId,
              transaction_id: transaction_id,
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
          message: err.message,
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
  const requestId = request.requestContext.requestId;
  try {
    let body = JSON.parse(request.body);

    let missingParamsArray = missingParams(body);
    if (missingParamsArray.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify(
          {
            success: false,
            message: "Missing Parameters: " + missingParamsArray.join(", "),
          },
          null,
          2
        ),
      };
    }

    const { app_user_hash, operation, tags, args } = body;
    let missingtagsArray = missingTags(tags);
    if (missingtagsArray.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify(
          {
            success: false,
            message: "Missing Tags: " + missingtagsArray.join(", "),
          },
          null,
          2
        ),
      };
    }

    let transaction_id = tags.transaction_id;
    let missingArgsArray = missingClaimArgs(args);
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

    // Forward request to Queue server

    const endpoint = process.env.QUEUE_SERVER_URL;

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
          app_user_hash: app_user_hash,
          tags: tags,
          args: args,
        })
      );
    if (queueserver_response) {
      // Log request in database

      let { message, code } = queueserver_response.body;
      // db.RequestLog.create({
      //   requestId: requestId,
      //   appUserHash: app_user_hash,
      //   operation: operation,
      //   tags: tags,
      //   args: args,
      //   status: code,
      // });
      if (code == 0) {
        return {
          statusCode: 200,
          body: JSON.stringify(
            {
              id: requestId,
              transaction_id: transaction_id,
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
          message: err.message,
        },
        null,
        2
      ),
    };
  }
}
function missingParams(bodyParams) {
  let arrayDiff = ["app_user_hash", "operation", "tags", "args"].filter(
    (a) => !Object.keys(bodyParams).includes(a)
  );
  // console.log(arrayDiff);
  return arrayDiff;
}
function missingTags(tagObject) {
  let arrayDiff = ["app_id", "action_id", "user_id", "transaction_id"].filter(
    (a) => !Object.keys(tagObject).includes(a)
  );
  return arrayDiff;
}

function missingCreateArgs(argObject) {
  let arrayDiff = ["creator_id", "token_metadata"].filter(
    (a) => !Object.keys(argObject).includes(a)
  );
  return arrayDiff;
}
function missingMetaDataArgs(metaObject) {
  let arrayDiff = [
    "title",
    "description",
    "media",
    "reference",
    "copies",
  ].filter((a) => !Object.keys(metaObject).includes(a));
  return arrayDiff;
}
function missingClaimArgs(argsObject) {
  let arrayDiff = ["token_id", "sender_id", "receiver_id"].filter(
    (a) => !Object.keys(argsObject).includes(a)
  );
  return arrayDiff;
}

module.exports = {
  createNftSeries: createNftSeries,
  viewNextNftInSeries: viewNextNftInSeries,
  claimtNftInSeries: claimtNftInSeries,
};
