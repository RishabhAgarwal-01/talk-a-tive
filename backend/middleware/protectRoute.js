import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

//middleware to check whether the user is verified or not before sending message and if verified adding the verified user's Id to the request
//to the next function in the send message route
const protectRoute = async(req, res, next)=>{
    try {
        //get the token from the req
        const token = req.cookies.jwt
        //check if token present
        if(!token){
            return res.status(401).json({error:"Unauthorized- no token found"})
        }
        //decode the token using the secret key
        const decoded= jwt.verify(token, process.env.JWT_SECRET)
        //if not able to decode then the token is invalid
        if(!decoded){
            return res.status(401).json({error:"Unauthorized- Invalid token"})
        }
        //get the user info from the User DB using the userId but remove the password
        const user = await User.findById(decoded.userId).select("-password");
        //check if user is present or not
        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        //if present then add the user to the request object by creating a new field user
        req.user= user;
        //call the next function
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({error:"Internal server error"})
    }
}

export default protectRoute;