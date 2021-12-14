const db = require("../db/models");
const Sequelize = require("sequelize");
const unirest = require("unirest");
const Op = Sequelize.Op;
async function fetchRequest(request) {
  try {
    let req = await db.RequestLog.findOne({
      where: {
        status: {
          [Op.eq]: "new",
        },
      },
      order: [
        ['createdAt', 'ASC']
    ],
    });


     // .then((req) => {
        if (req) {
          req.set({ status: "forwarded" });
          req.save();
          let json_request = req.toJSON();
          console.log(json_request);
          return {
            statusCode: 200,        
            
            body: JSON.stringify({
              requestId: json_request.requestId,
              operation: json_request.operation,
              tags: json_request.tags,
              args: json_request.args
            }),
          }
        } else {
          return {
            statusCode: 204,
            body: {"Message":"No pending request"}
          };
        }
   //   })
      // .catch((err) => {
      //   console.log(err);
      //   return {
      //     statusCode: 500,
      //     body: {"Message":"Server error"}
      //   };
      // });

    }

    catch(err){
      console.log(err);

      return {
        statusCode: 500,
        body: {"Message":"Server error"}
      };
    }

  }
module.exports = {
  fetchRequest: fetchRequest,
};
