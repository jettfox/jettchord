const  mongoose  = require("mongoose");
mongoose.Promise  = require("bluebird");
const  url  =  "mongodb://localhost:27017/group";
const  connectGroup  =  mongoose.connect(url, { useNewUrlParser: true  });
module.exports  =  connectGroup;