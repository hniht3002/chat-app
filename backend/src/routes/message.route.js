import express from "express";
import { getUsersForSidebar, getMessages,sendMessages } from "../controllers/message.controller.js";

import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router()

router.get("/users", protectedRoute, getUsersForSidebar)
router.get("/:id", protectedRoute, getMessages)
router.post("/send/:id", protectedRoute, sendMessages)


export default router;
