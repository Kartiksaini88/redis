let mongoose = require("mongoose")

let ProductSchema = mongoose.Schema(
    {
        name:{type:String,required:true},
        price:{type:Number,required:true},
        category:{type:String,required:false},
    },
    {
        versionKey:false,
        timestamps:true
    }
)
module.exports = mongoose.model("product",ProductSchema)