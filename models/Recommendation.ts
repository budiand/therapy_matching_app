import mongoose from "mongoose";

const RecommendationSchema = new mongoose.Schema(
  {
    issue: { type: String, required: true },

    preferredCity: { type: String },

    online: { type: Boolean },

    budget: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Recommendation ||
  mongoose.model("Recommendation", RecommendationSchema);
