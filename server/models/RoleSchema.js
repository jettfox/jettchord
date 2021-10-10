const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;
const  roleSchema  =  new Schema(
    {
        user: {type: String},
        group: {type: String},
        role: {type: String}
    });

let  Role  =  mongoose.model("Role", roleSchema);
module.exports  =  Role;