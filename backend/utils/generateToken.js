import jwt from "jsonwebtoken";

//take the userId and response object and create the token 
const generateTokenAndSetCookie= (userId, res)=>{
   const token = jwt.sign({userId}, process.env.JWT_SECRET,{
    expiresIn: '15d'
   })

   //create a cookie with the token and secure fields, send it back as the response
   res.cookie('jwt',token,{
    maxAge: 15*24*60*60*1000, //in ms
    httpOnly:true, //prevent XSS attacks which is also know as cross site scripting attacks
    sameSite:"strict", //CSRF attacks
    secure: process.env.NODE_ENV !== "development"
   })
}

export default generateTokenAndSetCookie;