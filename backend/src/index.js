import express from "express";
import dotenv from 'dotenv'
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser"
import cors from 'cors'
dotenv.config()
const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json({
    limit: '50mb'
}));
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5001

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

app.listen(PORT, () => {
    connectDB()
        .then(() => {
            console.log("Running on port " + PORT);
        })
})