import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { chatBot } from "../controller/chatbot.controller";

const chatBotRoute = Router()

chatBotRoute.post("/chatbot", authenticate, chatBot)

export default chatBotRoute