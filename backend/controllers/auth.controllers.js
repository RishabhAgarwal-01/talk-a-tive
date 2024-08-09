import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup= async(req, res)=>{
   try {
     //get the data from the request
     const {fullName, username, password, confirmPassword, gender} = req.body;

     //check for the password and confirmed password
     if(password !== confirmPassword){
      return res.status(400).json({error: 'Passwords do not match'})
     }
     //check for the username if it is already taken or not
     const user = await User.findOne({username});
     if(user){
      return res.status(400).json({error:"username already taken"});
     }

     //if everything is ok then hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

     //make the girl and boy profile pic
      const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

      //create a new user
      const newUser = new User({
         fullName,
         username,
         password: hashedPassword,
         gender,
         profilePic: gender === "male"? boyProfilePic : girlProfilePic
      })
      
      //if newUser is created then ...
      if(newUser){
         //generate JWT token
         generateTokenAndSetCookie(newUser._id, res)
         //save the new user
         await newUser.save();
         //return the response to the front end 
         res.status(201).json({
           _id: newUser._id,
           fullName: newUser.fullName,
           username:newUser.username,
           profilePic: newUser.profilePic
         })
      }

   } catch (error) {
      //handle the error
     console.log("error in the signup controller", error.message)
     res.status(500).json(({error:"Internal Server Error"}));
   }
}

//login controller
export const login= async(req, res)=>{
 try {
   //take the username and password
    const {username, password} = req.body;
    //search for the user in DB
    const user= await User.findOne({username});
    //check if password mathces with the stored password
    const isPasswordCorrect = await bcrypt.compare(password, user?.password||"")

    //if user not exist or password not matches then return the error
    if(!user || !isPasswordCorrect){
      return res.status(400).json({error:"Invalid User or Password"})
    }

    //if matches then generate the token
    generateTokenAndSetCookie(user._id, res);

    //return resopone back to the frontend
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic
    })
 } catch (error) {
   //handle the error
     console.log("error in the login controller", error.message)
     res.status(500).json(({error:"Internal Server Error"}));
 }

}

//logout controller
export const logout= (req, res)=>{
  try {
    res.cookie("jwt", "", {maxAge:0});
    res.status(200).json({message: "Logged out successfully"});
    
  } catch (error) {
      //handle the error
      console.log("error in the logout controller", error.message)
      res.status(500).json(({error:"Internal Server Error"}));
  }
}