const  mongoose  = require("mongoose");
mongoose.Promise  = require("bluebird");
const  url  =  "mongodb://localhost:27017/jettcord";
const  connectJettcord  =  mongoose.connect(url, { useNewUrlParser: true  });
module.exports  =  connectJettcord;