// const db = require("../db/models");
// const Sequelize = require("sequelize");
// const Op = Sequelize.Op;
async function createAccount(request) {
  //console.log(request);
  // const apiUser = await db.ApiUser.findOne({
  //   where: {
  //     apiKey: {
  //       [Op.eq]: request.authorizationToken,
  //     },
  //   },
  // });
  // if (apiUser) {
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
//   } else {
//     return {
//       statusCode: 403,
//       body: JSON.stringify(
//         {
//           message: "No user found",
//         },
//         null,
//         2
//       ),
//     };
//   }
}

module.exports = {
  createAccount: createAccount,
};
