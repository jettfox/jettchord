const  mongoose  = require("mongoose");
mongoose.Promise  = require("bluebird");
const  url  =  "mongodb://localhost:27017/user";
const  connectUser  =  mongoose.connect(url, { useNewUrlParser: true  });
module.exports  =  connectUser;