async function sendLog(request) {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Success",
      },
      null,
      2
    ),
  };
}

module.exports = {
  sendLog: sendLog,
};
