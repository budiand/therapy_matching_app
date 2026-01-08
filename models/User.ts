import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: { type: String, required: true, trim: true },

        passwordHash: { type: String, required: true },

        age: { type: Number, required: true, min: 13, max: 120 },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
