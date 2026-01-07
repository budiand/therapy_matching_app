import mongoose from "mongoose";

const TherapistSchema = new mongoose.Schema(
    {
        /* =====================
           BASIC INFO
        ====================== */
        name: { type: String, required: true },

        gender: {
            type: String,
            enum: ["female", "male", "non_binary", "other"],
        },

        languages: [{ type: String }], // ["English", "Romanian"]

        city: { type: String, required: true },

        online: { type: Boolean, default: false },

        priceRange: {
            type: String, // ex: "50-70 EUR"
        },

        description: { type: String },

        yearsOfExperience: { type: Number },

        /* =====================
           SPECIALIZATION / TOPICS
        ====================== */
        specializations: [
            {
                type: String,
                enum: [
                    "Anxiety",
                    "Depression",
                    "Panic attacks",
                    "Burnout",
                    "Stress",
                    "Relationships",
                    "Family",
                    "Couples",
                    "Trauma",
                    "Grief",
                    "LGBTQ+",
                    "Self-esteem",
                    "Career",
                    "Addictions",
                    "Anger management",
                    "Sleep problems",
                ],
            },
        ],

        /* =====================
           THERAPEUTIC APPROACH
        ====================== */
        approaches: [
            {
                type: String,
                enum: [
                    "CBT",
                    "ACT",
                    "Psychodynamic",
                    "Humanistic",
                    "Schema therapy",
                    "Systemic",
                    "Integrative",
                    "Mindfulness-based",
                ],
            },
        ],

        /* =====================
           MATCHING – STYLE & FIT
           (core differentiator)
        ====================== */

        sessionStructure: {
            type: String,
            enum: ["structured", "semi", "free"],
        },

        therapistActivity: {
            type: String,
            enum: ["active", "balanced", "listening"],
        },

        communicationStyle: {
            type: String,
            enum: ["monologue", "questions", "mix"],
        },

        guidanceStyle: {
            type: String,
            enum: ["autonomous", "need_push", "mix"],
        },

        focusStyle: {
            type: String,
            enum: ["thoughts", "emotions", "mix"],
        },

        givesHomework: {
            type: Boolean, // true = CBT-ish, action oriented
            default: false,
        },

        /* =====================
           PRACTICAL DETAILS
        ====================== */
        worksWithHabits: {
            type: Boolean, // addictions, habit change
            default: false,
        },

        acceptsOnlineOnly: {
            type: Boolean,
            default: false,
        },

        ageGroups: [
            {
                type: String,
                enum: ["children", "teens", "adults", "seniors"],
            },
        ],

        /* =====================
           META / VISIBILITY
        ====================== */
        isActive: {
            type: Boolean,
            default: true,
        },

        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Therapist ||
mongoose.model("Therapist", TherapistSchema);
