import User from "../models/user.model.js";


//controller to get the users for displaying in the sidebar
export const getUserForSidebar = async(req, res)=>{
    try {
        //get the current user or logged in user id
        const loggedIdUserId = req.user._id;

       //get all the users other than the current user
        const filteredUsers = await User.find({
            //using the ne --> notequals operator 
            _id:{$ne:loggedIdUserId}
        })

        return res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUserForSidebar controller", error.message);
        res.status(500).json({error:"Internal server error"})
    }
}