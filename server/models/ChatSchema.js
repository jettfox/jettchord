const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;
const  chatSchema  =  new Schema(
    {
        user: {type: String},
        message:{type: String},
        channel: {type: String},
        group: {type: String}
    }
);

let  Chat  =  mongoose.model("Chat", chatSchema);
module.exports  =  Chat;