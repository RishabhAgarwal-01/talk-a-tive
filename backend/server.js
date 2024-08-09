import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import userRoutes from "./routes/user.routes.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT= process.env.PORT || 5000

//Mongo DB connection
mongoose.connect(process.env.MONGO_DB_URI).then(()=>{
    console.log("Connected to DB")
})
.catch((err)=>{
    console.log(err);
})

//middleware to parse the incoming request with JSON payloads (from req.body)
app.use(express.json());
//parsing the cookies
app.use(cookieParser());

//api route for the auth
app.use("/api/auth", authRoutes);
//api route for the messages
app.use("/api/messages", messageRoutes);
//api route for the users
app.use("/api/users", userRoutes);


app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`))