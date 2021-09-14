const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    trues:{
        type:Number
    },
    falses:{
        type:Number
    },
    percentage:{
        type:Number
    }
},
{
    timestamps:true
})
const User = mongoose.model('User',UserSchema)

module.exports = User