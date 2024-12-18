import mongoose from "mongoose";

const userSchema = new mongoose.Schema( {
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

userSchema.pre("save", function (next) {
    if (!this.profilePic) {
        const encodedFullName = encodeURIComponent(this.fullName);
        this.profilePic = `https://avatar.iran.liara.run/username?username=${encodedFullName}`;
    }
    next();
});

const User = mongoose.model("User", userSchema);

export default User;