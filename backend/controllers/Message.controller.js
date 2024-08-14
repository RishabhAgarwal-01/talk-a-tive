import Conversation from "../models/converstion.model.js"
import Message from "../models/message.model.js";
import { getRecieverSocketId,io } from "../socket/socket.js";

//controller to save the messages received to the database
export const sendMessage = async(req, res)=>{
    try {
        //get the message and receiverId 
        const {message}= req.body;
        const {id: receiverId}= req.params;
        //get the senderId from the protectRoute middleware
        const senderId= req.user._id;

        //find the conversation in the database 
        let conversation = await Conversation.findOne({
            //the mongoose syntax to find all the entries with the given data from the participants field
            participants:{$all: [senderId, receiverId]}
        })

        //if they are interacting for the first time then create a fresh conversation
        if(!conversation){
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            })
        }

        //create the new message
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        })

        //push the messageId in the conversation -->message field which is the array of message id
        if(newMessage){
            conversation.messages.push(newMessage._id);
        }        

        //we can do this also but it will not run parallel so 
        // await conversation.save();
        // await newMessage.save();

        //save the conversaion and new message using the Promise
        await Promise.all([conversation.save(), newMessage.save()]);
        
        //socket io functionality
        const receiverSocketId = getRecieverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        
        //return the respone
        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controll", error.message);
        res.status(500).json({error:"Internal server error"})
    }
}

//controller for geting the messages between 2 users
export const getMessages = async(req, res)=>{
    try {
        const {id: userToChatId} = req.params;
        const senderId = req.user._id;

        //find the conversation in the database 
        const conversation = await Conversation.findOne({
            //the mongoose syntax to find all the entries with the given data from the participants field
            //and populate the message field with the messages object itself rather than just the message id
            participants:{$all: [senderId, userToChatId]}
        }).populate("messages");

        // Handle the case where no conversation is found
        if (!conversation) return res.status(200).json([]);
        
        const messages = conversation.messages;
        res.status(200).json(messages);

    } catch (error) {
        console.log("Error in getMessages controll", error.message);
        res.status(500).json({error:"Internal server error"})
    }
}