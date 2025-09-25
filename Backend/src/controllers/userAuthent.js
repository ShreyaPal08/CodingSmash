const redisClient = require("../config/redis");
const User=require("../models/user")
const validate=require('../utils/validator');
const bcrypt=require("bcrypt")
const jwt = require('jsonwebtoken');
const Submission=require("../models/submission")

const register=async(req,res)=>{
    try{
        //validate the data

        validate(req.body);
        const {firstName,emailId,password}=req.body;
        
        //password ko hashcode me change kar diya
        req.body.password=await bcrypt.hash(password,10);
       //req.body.role='admin';//aisa karne se chahe role admin dalo register karte waqt ye role user hi jayega*****ishu name ka register kiya hai example ke liye
         

        const user= await User.create(req.body);
        const token= jwt.sign({_id:user._id, emailId:emailId,role:'user'},process.env.JWT_KEY,{expiresIn: 60*60});
        
          const reply={
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id
        }

        res.cookie('token',token,{maxAge:60*60*1000});
        res.status(201).json({
            user:reply,
            message:"Registered Successfully"
        })
       
    }

    catch(err){
        res.status(400).send("Error: " +err);

    }
}

const login=async(req,res)=>{
    try{
        const {emailId,password}=req.body;

        if(!emailId)
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");

        const user=await User.findOne({emailId});

         if(!user){
            throw new Error("Invalid Credentials");
        }

        const match=await bcrypt.compare(password,user.password);

        if(!match){
            throw new Error("Invalid Credentials");
        }
        
        const reply={
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id,
            role:user.role
        }


        const token= jwt.sign({_id:user._id, emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn: 60*60})
        res.cookie('token',token,{maxAge:60*60*1000});
        res.status(200).json({
            user:reply,
            message:"LoggedIn Successfully"
        })
    }
    catch(err){
        res.status(401).send("Error: "+err);
    }
}

const logout=async(req,res)=>{
    try{
         const {token}=req.cookies;

         const payload=jwt.decode(token);

         await redisClient.set(`token:${token}`,'Blocked');
         await redisClient.expireAt(`token:${token}`,payload.exp);
         //Token add kr denge redis ke blocklist 
         //cookies ko clear kar dena

         res.cookie("token",null,{expires:new Date(Date.now())});
         res.send("Logged Out Successfully");
          
    }
    catch(err){
        res.status(503).send("Error: "+err);
    }
}

const adminRegister=async(req,res)=>{
    try{

        //aise bhi kar sakte hai adminMidddleware ko na bna ke userMiddlewaere kanhi use kar sakte hai

        // if(req.result.role!='admin')
        //     throw new Error("Invalid Credentials");

        validate(req.body);
        const{firstName,emailId,password}=req.body;
        req.body.password=await bcrypt.hash(password,10);
      //  req.body.role='admin';  //isko hta denge aur jwt,sign me role:user.role kar denge to admin ke pass dono poer aa jayegi as admin register hone kin aur as user krane ki bhi

        const user=await User.create(req.body);
       // const token=jwt.sign({_id:user._id,emailId:emailId,role:'admin'},process.env.JWT_KEY,{expiresIn:60*60});

        const token=jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60});

        res.cookie('token',token,{maxAge:60*60*1000});
        res.status(201).send("Admin Registered Successfully!!");

    }
    catch(err){
         res.status(400).send("Error: "+err);
    }
}


const deleteProfile=async(req,res)=>{
    try{
        const userId=req.result._id;
       

        //userSchema delete
        await User.findByIdAndDelete(userId);

        //Submission se bhi delete karo....

        //await Submission.deleteMany({userId});

        res.status(200).send("Delete Successfully");

    }

    catch(err){
          res.status(500).send("Internal Server Error");
    }
}


module.exports={register,login,logout,adminRegister,deleteProfile}