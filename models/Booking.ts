import mongoose, { Schema, models } from "mongoose";

const BookingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    therapistName: {
      type: String,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default models.Booking || mongoose.model("Booking", BookingSchema);
