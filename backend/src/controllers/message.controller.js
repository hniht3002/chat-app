import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js"
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password")
        return res.status(200).json(filteredUsers)
    
    } catch (error) {
        console.log("Error in getUsersForSidebar controller: ", error.message);
        return res.status(500).json({error: "Internal Server Error"})
    }
}

export const getMessages = async (req, res) => {
    try {
        const userToChatId = req.params.id;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: senderId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: senderId}
            ]
        })
        
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        return res.status(500).json({error: "Internal Server Error"})
    }
}

export const sendMessages = async (req, res) => {
    try {
        const userToChatId = req.params.id;
        const senderId = req.user._id;
        const {text, image} = req.body;

        let imageUrl;

        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url
        }
        
        const newMessage = new Message({
            senderId: senderId,
            receiverId: userToChatId,
            text: text,
            image: imageUrl
        })

        await newMessage.save()

        //socket.io

        res.status(200).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessages controller: ", error.message);
        return res.status(500).json({error: "Internal Server Error"})
    }
}