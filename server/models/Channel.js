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

let  Group  =  mongoose.model("Channel", channelSchema);
module.exports  =  Group;