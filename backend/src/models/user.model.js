import mongoose from "mongoose";

const userChema = new mongoose.Schema( {
    email: {
        type: String,
        required: true,
        unique: true
    },

    fullName: {
        type: String,
        required: true,
        minLength: 6
    },

    password: {
        type: String,
        required: true,
        minLength: 6
    },

    profilePic: {
        type: String,
        default: ""
    }
}, {timestamps: true});

const User = mongoose.model("User", userChema);

export default User;