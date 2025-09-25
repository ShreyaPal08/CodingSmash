const express=require('express')
const app=express();
require('dotenv').config();
//import the db
const main=require('./config/db')
const cookieParser=require('cookie-parser');
const authRouter=require('./Routes/userAuth');
const redisClient = require('./config/redis');
const problemRouter=require('./Routes/problemCreator')
const submitRouter=require("./Routes/submit")
const aiRouter=require("./Routes/aiChatting")
const videoRouter = require("./Routes/videoCreator");
const cors=require('cors')



app.use(cors({
    origin:'http://localhost:5173',  //agr * likh diya to koi bhi host ho ager ye likha hi to particular yhi 
    credentials:true
}))

app.use(express.json());
app.use(cookieParser());
app.use('/user',authRouter);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);
app.use('/ai',aiRouter);
app.use("/video", videoRouter);

const InitalizeConnection=async()=>{
    try{
        await Promise.all([main(),redisClient.connect()]);
        console.log("DB Connected");
        app.listen(process.env.PORT,()=>{
            console.log("Server listening at port number: "+ process.env.PORT);
        })
    }
    catch(err){
        console.log("Error: "+err);
    }
}

InitalizeConnection();





