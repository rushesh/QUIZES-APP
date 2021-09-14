const mongoose = require('mongoose')
var connection = mongoose.connection
const makeConnection = async ()=> {
    try {
        const uri = "mongodb://localhost:27017/RWaltzApp"
        await mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology:true});
        console.log("Connected to DB !")
        connection = mongoose.connection;
      } catch (error) {
        console.log("Error occured while connecting !"+error)
      }
}

module.exports = {
    makeConnection, connection
}