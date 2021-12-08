async function createNftSeries(request) {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "NFT does not exist",
      },
      null,
      2
    ),
  };
}

async function viewNextNftInSeries(request) {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "next NFT found",
        token_id: 125,
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
