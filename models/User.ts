import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        passwordHash: {
            type: String,
            required: true,
        },

        age: {
            type: Number,
            required: true,
            min: 13,
            max: 120,
        },

        recommendedTherapists: [
            {
                therapistId: {
                    type: Schema.Types.ObjectId,
                    ref: "Therapist",
                    required: true,
                },
                score: {
                    type: Number,
                    required: true,
                },
                reasons: {
                    type: [String],
                    default: [],
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.User ||
    mongoose.model("User", UserSchema);
