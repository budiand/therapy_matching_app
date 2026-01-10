import mongoose from "mongoose";

const CitySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        normalized: {
            type: String,
            required: true,
            index: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.City ||
    mongoose.model("City", CitySchema);
