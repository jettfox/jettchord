const  mongoose  = require("mongoose");
mongoose.Promise  = require("bluebird");
const  url  =  "mongodb://localhost:27017/role";
const  connectRole  =  mongoose.connect(url, { useNewUrlParser: true  });
module.exports  =  connectRole;