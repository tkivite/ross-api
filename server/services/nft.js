const unirest = require("unirest");
async function sendNft(request) {
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
            message: "Missing Parameters: " + missingParamsArray.join(" "),
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
            message: "Missing Tags: " + missingtagsArray.join(" "),
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
          requestId: requestId,
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
function missingParams(bodyParams) {
  let arrayDiff = [
    "app_user_hash",
    "requestId",
    "operation",
    "tags",
    "args",
  ].filter((a) => !Object.keys(bodyParams).includes(a));
  console.log(arrayDiff);
  return arrayDiff;
}
function missingTags(tagObject) {
  let arrayDiff = ["app_id", "action_id", "user_id"].filter(
    (a) => !Object.keys(tagObject).includes(a)
  );
  return arrayDiff;
}
module.exports = {
  sendNft: sendNft,
};
