const authService = require("./auth");

async function createAccount(request) {
  authService.verifyUser(request.headers).then((res) => {
    if (res) {
      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            message: "Account created",
          },
          null,
          2
        ),
      };
    } else {
      return {
        statusCode: 403,
        body: JSON.stringify(
          {
            message: "Invalid API key",
          },
          null,
          2
        ),
      };
    }
  });
}

module.exports = {
  createAccount: createAccount,
};
