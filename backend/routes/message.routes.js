import express from "express"
import { sendMessage,getMessages } from "../controllers/Message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

//send message route
router.post('/send/:id',protectRoute,sendMessage);
//
router.get('/:id',protectRoute,getMessages);


export default router;