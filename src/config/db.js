import mongoose from "mongoose";
import dotenv from "dotenv";
import {success,error} from "../services/responseWrapper.js";
dotenv.config();



export  default async function connectDB(req,res){
    try {
        const connect = await mongoose.connect(process.env.mongoURL);
        console.log('db connected'+ connect.connection.host);
     
    } catch (error) {
       console.error("Error connecting")
         res.status(500).json({message:"Error connecting"})
        
    }
    
}