
const db = require("./server/db/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
exports.handler = function (event, context, callback) {
  console.log(event);  
  var token = checkUser(event.authorizationToken);
  switch (token) {
    case "allow":
      callback(null, generatePolicy("user", "Allow", event.methodArn));
      break;
    case "deny":
      callback(null, generatePolicy("user", "Deny", event.methodArn));
      break;
    case "unauthorized":
      callback("Unauthorized"); // Return a 401 Unauthorized response
      break;
    default:
      callback("Error: Invalid token"); // Return a 500 Invalid token response
  }
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
  if(!token){
    return "unauthorized";
  }  
  const apiUser = await db.ApiUser.findOne({
    where: {
      apiKey: {
        [Op.eq]: token,
      },
    },
  });
  if (apiUser) {
    return "allow";
  }
  return "deny";
  
};
