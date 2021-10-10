const  mongoose  = require("mongoose");
mongoose.Promise  = require("bluebird");
const  url  =  "mongodb://localhost:27017/channel";
const  connectChannel  =  mongoose.connect(url, { useNewUrlParser: true  });
module.exports  =  connectChannel;