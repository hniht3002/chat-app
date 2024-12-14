import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import cloudinary from "../lib/cloudinary.js"
export const signup = async (req, res) => {
    try {
        const {fullName, email, password} = req.body
        //hashing password

        if(!fullName || !email || !password) {
            return res.status(400).json({message: "All field are required"})
        }

        if(fullName.length < 6) {
            return res.status(400).json({message: "Full name must be at least 6 characters"})
        }

        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"})
        }

        const user = await User.findOne({email})

        if (user) {
            return res.status(400).json({message: "Email already exists"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        })

        if(newUser) {
            const token = generateToken(newUser._id, res)
            await newUser.save()

            return res.status(201).json({
                _id: newUser. _id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })

        } else {
            return res.status(400).json({message: "Invalid user data"}) 
        }

    } catch (error) {
        console.log("Error in signup controller: ", error.message);
        return res.status(500).json({error: "Internal Server Error"}) 
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body
        
        const user = await User.findOne({email})

        if(!user) {
            return res.status(400).json({message: "Invalid credentials"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect) {
            return res.status(400).json({message: "Invalid credentials"})
        }

        generateToken(user._id, res)

        return res.status(201).json({
            _id: user. _id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch (error) {
        console.log("Error in login controller: ", error.message);
        return res.status(500).json({error: "Internal Server Error"}) 
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0})
        return res.status(200).json({message: "Log out successfully"})

    } catch (error) {
        console.log("Error in logout controller: ", error.message);
        return res.status(500).json({error: "Internal Server Error"}) 
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;

        const userId = req.user._id;

        if(!profilePic) {
            return res.status(400).json({message: "Profile pic is required"})
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true})
        
        return res.status(200).json(updatedUser)

    } catch (error) {
        console.log("Error in update profile controller: ", error.message);
        return res.status(500).json({error: "Internal Server Error"}) 
    }
}

export const checkAuth = (req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in check auth controller: ", error.message);
        return res.status(500).json({error: "Internal Server Error"}) 
    }
}