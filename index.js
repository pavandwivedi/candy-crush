import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import userRouter from "./src/routes/user.route.js";
import levelRouter from "./src/routes/level.route.js";
import versionRouter from "./src/routes/version.route.js";
import adminRouter from "./src/routes/admin.route.js";
import morgan from "morgan";
import challengeRouter from "./src/routes/challenge.route.js";
import shopRouter from "./src/routes/shop.route.js";
import cors from "cors";
const app = express();
dotenv.config();
connectDB();
app.use(morgan("common"));
app.use(cors());
app.use(express.json());

// routes

app.use('/user',userRouter);
app.use('/level',levelRouter);
app.use('/admin',adminRouter);
app.use('/version',versionRouter);
app.use('/challenge',challengeRouter);
app.use('/shop',shopRouter);

const port = process.env.port||6500;
app.listen(port,()=>{
    console.log(`server running on port${port}`);
})