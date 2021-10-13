const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;
const  channelSchema  =  new Schema(
    {
        name: {
            type:String
        },
        group:{
            type:String
        }
});

let  Channel  =  mongoose.model("Channel", channelSchema);
module.exports  =  Channel;