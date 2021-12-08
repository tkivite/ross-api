async function sendNft(request) {
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
  sendNft: sendNft,
};
