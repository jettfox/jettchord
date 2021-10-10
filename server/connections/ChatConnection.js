const  mongoose  = require("mongoose");
mongoose.Promise  = require("bluebird");
const  url  =  "mongodb://localhost:27017/chat";
const  connectChat  =  mongoose.connect(url, { useNewUrlParser: true  });
module.exports  =  connectChat;