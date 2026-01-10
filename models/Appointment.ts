import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
    {
        therapistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Therapist",
            required: true,
            index: true,
        },

        // IMPORTANT: user, nu client
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        dateISO: { type: Date, required: true, index: true },
        durationMin: { type: Number, default: 50 },

        location: {
            type: String,
            enum: ["online", "in_person"],
            required: true,
        },

        status: {
            type: String,
            enum: ["scheduled", "completed", "cancelled", "no_show"],
            default: "scheduled",
            index: true,
        },

        notesPreview: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.Appointment ||
mongoose.model("Appointment", AppointmentSchema);
