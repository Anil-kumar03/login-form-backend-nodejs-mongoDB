const mongoose = require('mongoose')

let Registeruser = new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    confirmpassword:{
        type:String,
        require:true,
    }
    
})
module.exports = mongoose.model("Registeruser",Registeruser);