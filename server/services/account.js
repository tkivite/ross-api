const db = require("../db/models");
const Sequelize = require("sequelize");
const unirest = require("unirest");
const Op = Sequelize.Op;
async function createAccount(request) {
  const requestId = request.requestContext.requestId;
  try {
    let body = JSON.parse(request.body);

    // console.log(Object.keys(body));
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
          tags: tags,
          args: args,
        })
      );
    if (queueserver_response) {
      console.log(queueserver_response.body);
      let { message, code } = queueserver_response.body;
      db.RequestLog.create({
        requestId: requestId,
        operation: operation,
        tags: tags,
        args: args,
        status: code,
      });
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
  let arrayDiff = ["app_id", "action_id", "user_id"].filter(
    (a) => !Object.keys(tagObject).includes(a)
  );
  return arrayDiff;
}

module.exports = {
  createAccount: createAccount,
};
