async function createAccount(request) {
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
}

module.exports = {
  createAccount: createAccount,
};
