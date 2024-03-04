import mongoose from "mongoose";
import dotenv from "dotenv";
import {success,error} from "../services/responseWrapper.js";
dotenv.config();



export  default async function connectDB(){
    try {
        const connect = await mongoose.connect(process.env.mongoURL);
        console.log('db connected'+connect.connection.host);
    } catch (err) {
        return res.send(error(500,err.message));
    }
    
}