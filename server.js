const express = require('express');
const mongoose = require("mongoose")
const dotEnv = require("dotenv");
const Registeruser = require('./model')
const jwt = require('jsonwebtoken');
const middleware = require("./middleware")
const cors = require("cors")
const app = express();

dotEnv.config()
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("DB connected successful"))
.catch((error)=> console.log(error));

app.use(cors({origin:"*"}))
app.use(express.json()); //middlewear
app.post('/register', async (req,res)=>{
    try{
        //checking is user already registered or not
        const {username,email,password,confirmpassword}=req.body;
        let exist = await Registeruser.findOne({email:email}) //user's email : stored email id 
        if (exist){
            return res.status(400).send("user already exist")
        }
        //if no user registered then new user will be created
        let newUser = new Registeruser({
            username,
            email,
            password,
            confirmpassword
        })
        await newUser.save()
        res.status(200).send("Registration Success")
        //password checking
        if (password !== confirmpassword){
            return res.status(400).send("passwords are not  matching");
        }

    }catch(err){
        console.log(err)
        return res.status(500).send("Internal server Error")
    }

});

app.post('/login', async (req,res)=>{
    try{
        const {email,password} = req.body
        let exist = await Registeruser.findOne({email:email})
        if (!exist){
            return res.status(400).send("User Not Found");
        }
        if (exist.password !== password){
            return res.status(400).send("Invalid Credentials")
        }

        let payload = {
            user:{
                id:exist.id
            }
        }
        jwt.sign(payload,'jwtSecret',{expiresIn:65000000},
            (error,token)=>{
                if (error) throw error;
                return res.json({token})
            }
        )
    }catch(error){
        console.log(error)
        return res.status(500).send("Internal server Error")
    }
})

app.get('/myprofile',middleware,async(req,res)=>{
    try{
        let exist = await Registeruser.findById(req.user.id);
        if(!exist){
            return res.status(400).send("User Not Found")
        }
        res.json(exist)
    }catch(error){
        console.log(error)
        res.status(500).send("Internal server error")
    }
})


PORT = 5000
app.listen(5000,()=>{
    console.log(`server is running at ${PORT}` )
})