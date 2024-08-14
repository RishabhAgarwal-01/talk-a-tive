import {Server} from "socket.io";
import http from 'http';
import express from "express";

const app = express();

const server= http.createServer(app);
const io= new Server(server,{
    cors:{
        origin:["http://localhost:3000"],
        methods:["GET", "POST"]
    }
});

export const getRecieverSocketId = (receiverId)=>{
    return userSocketMap[receiverId];
}
const userSocketMap={}; 

io.on('connection', (socket)=>{
    console.log("A User connected", socket.id)

    // console.log(userSocketMap)
    const userId = socket.handshake.query.userId;

    if(userId != 'undefined'){
        userSocketMap[userId]=socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    //console.log(userSocketMap)
    socket.on('disconnect', ()=>{
        console.log("User is disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

export {app, io, server}