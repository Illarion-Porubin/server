import mongoose from "mongoose";

const UserModel = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatarUrl: String,
    },
    {
        timestamps: true
    }
)

export default mongoose.model(`User`, UserModel)
