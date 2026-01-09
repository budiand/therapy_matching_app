import mongoose from "mongoose";

const SlotSchema = new mongoose.Schema(
    {
        start: { type: String, required: true }, // "09:00"
        end: { type: String, required: true },   // "12:30"
    },
    { _id: false }
);

const WeeklySchema = new mongoose.Schema(
    {
        Mon: { type: [SlotSchema], default: [] },
        Tue: { type: [SlotSchema], default: [] },
        Wed: { type: [SlotSchema], default: [] },
        Thu: { type: [SlotSchema], default: [] },
        Fri: { type: [SlotSchema], default: [] },
        Sat: { type: [SlotSchema], default: [] },
        Sun: { type: [SlotSchema], default: [] },
    },
    { _id: false }
);

const AvailabilitySchema = new mongoose.Schema(
    {
        therapistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Therapist",
            required: true,
            unique: true,
            index: true,
        },
        weekly: {
            type: WeeklySchema,
            default: () => ({}),
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Availability ||
mongoose.model("Availability", AvailabilitySchema);
