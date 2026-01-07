import mongoose from "mongoose";

const TherapistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    specialization: { type: String, required: true },

    approaches: [{ type: String }], // CBT, psihodinamic etc

    city: { type: String, required: true },

    online: { type: Boolean, default: false },

    priceRange: { type: String },

    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Therapist ||
  mongoose.model("Therapist", TherapistSchema);
