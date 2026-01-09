import mongoose from "mongoose";

const UserNoteSchema = new mongoose.Schema(
    {
        therapistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Therapist",
            index: true,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            index: true,
            required: true,
        },

        title: { type: String },
        content: { type: String, required: true },
        tags: [{ type: String, default: [] }],
    },
    { timestamps: true }
);

export default mongoose.models.UserNote || mongoose.model("UserNote", UserNoteSchema);
