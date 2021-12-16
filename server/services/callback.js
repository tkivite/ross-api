const db = require("../db/models");
const Sequelize = require("sequelize");
const unirest = require("unirest");
const Op = Sequelize.Op;
async function response(request) {
  //const requestId = request.requestContext.requestId;
  try {
    console.log(request.body);
    const { id, success, operation, explorerUrl, app_id, tags, args } =
      JSON.parse(request.body);

    //Perform Request to APP server
    const success_endpoint = process.env.APP_SERVER_SUCCESS_ENDPOINT;
    const failure_endpoint = process.env.APP_SERVER_FAILURE_ENDPOINT;
    //console.log(success);
    let endpoint = success == true ? success_endpoint : failure_endpoint;
    //console.log(endpoint);
    const appserver_response = await unirest
      .post(endpoint)
      .headers({
        Accept: "application/json",
        "Content-Type": "application/json",
      })
      .send(
        JSON.stringify({
          id: id,
          success: success,
          operation: operation,
          explorerUrl: explorerUrl,
          app_id: app_id,
          tags: tags,
          args: args,
        })
      );

    if (appserver_response) {
      console.log(appserver_response.body);
      let { success } = appserver_response.body;
      //console.log(code);
      // db.CallbackLog.create({
      //   requestId: requestId,
      //   operation: operation,
      //   tags: tags,
      //   args: args,
      //   success: success,
      // });
      if (success) {
        return {
          statusCode: 200,
          body: JSON.stringify(
            {
              success: true,
              message: "callback saved",
            },
            null,
            2
          ),
        };
      } else {
        console.log(appserver_response);
        return {
          statusCode: 400,
          body: JSON.stringify(
            {
              success: false,
              message: "callback not saved",
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
module.exports = {
  response: response,
};
