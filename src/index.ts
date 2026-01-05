import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import authRouter from "./routes/auth";
import mongoose from "mongoose";
import diseaseRouter from "./routes/disease";
import chatBotRoute from "./routes/chatBot";
import profileRouter from "./routes/profile";
import petRouter from "./routes/pet";
import petDetailsRouter from "./routes/petDetails";

dotenv.config();

const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI as string

const app = express()

app.use(express.json())
app.use(
    cors({
      // origin: ["http://localhost:5173","http://localhost:8080"],
      origin: ["https://happy-paws-frontend.vercel.app/api/happy-paws"],
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
)

app.use("/api/happy-paws/auth", authRouter)

app.use("/api/happy-paws/pet", petRouter)

app.use("/api/happy-paws/diseases", diseaseRouter)

app.use("/api/happy-paws/chat", chatBotRoute)

app.use("/api/happy-paws/profile", profileRouter)

app.use("/api/happy-paws/pet-details", petDetailsRouter)



mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("DB connected")
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })

  app.listen(PORT, () => {
    console.log("Server is running")
  })



