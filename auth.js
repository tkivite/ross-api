exports.authorize = function (event, context, callback) {
  if (!event.authorizationToken) {
    callback("Unauthorized");
  }
  callback(null, generatePolicy("user", "Deny", event.methodArn));

  // db.ApiUser.findOne({
  //   where: {
  //     apiKey: {
  //       [Op.eq]: event.authorizationToken,
  //     },
  //   },
  // })
  //   .then((apiUser) => {
  //     if (apiUser) {
  //       callback(null, generatePolicy("user", "Allow", event.methodArn));
  //     } else {
  //       callback(null, generatePolicy("user", "Deny", event.methodArn));
  //     }
  //   })
  //   .catch((err) => {
  //     callback(null, generatePolicy("user", "Deny", event.methodArn));
  //   });
};

// Help function to generate an IAM policy
var generatePolicy = function (principalId, effect, resource) {
  var authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    var policyDocument = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    var statementOne = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  // Optional output with custom properties of the String, Number or Boolean type.
  authResponse.context = {
    stringKey: "stringval",
    numberKey: 123,
    booleanKey: true,
  };
  return authResponse;
};

var checkUser = function (token) {
  if (!token) {
    return "unauthorized";
  }
  db.ApiUser.findOne({
    where: {
      apiKey: {
        [Op.eq]: token,
      },
    },
  })
    .then((apiUser) => {
      console.log(apiUser);
      // let apiUser = apiUser.toJSON();
      //     amountPledged = pledge.amountPledged;
      if (apiUser) {
        return "allow";
      } else {
        return "deny";
      }
    })
    .catch((err) => {
      console.log(err);
      return "deny";
    });
  return "deny";
};
