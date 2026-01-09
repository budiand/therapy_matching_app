import mongoose from "mongoose";

/**
 * Optional helper schemas for uploads / credentials
 */
const CredentialSchema = new mongoose.Schema(
    {
        label: { type: String }, // e.g. "College license", "CBT Certificate"
        type: {
            type: String,
            enum: ["license", "degree", "certificate", "other"],
            default: "certificate",
        },

        // If it's a certificate for a specific approach (CBT/ACT/etc.)
        relatedApproaches: [
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
                    "Gestalt",
                    "DBT",
                    "EMDR",
                ],
            },
        ],

        issuer: { type: String }, // e.g. "Beck Institute"
        issuedAt: { type: Date },
        expiresAt: { type: Date },

        // Where the uploaded file lives (S3/Cloudinary/Uploadcare/etc.)
        fileUrl: { type: String, required: true },
        fileName: { type: String },
        fileType: { type: String }, // pdf/jpg/png
    },
    { _id: false }
);

const TherapistSchema = new mongoose.Schema(
    {
        /* =====================
           ACCOUNT / AUTH
        ====================== */
        email: { type: String, required: true, unique: true, index: true },
        passwordHash: { type: String, required: true }, // store hash, NOT plaintext

        /* =====================
           BASIC INFO
        ====================== */
        name: { type: String, required: true },
        age: { type: Number, min: 18, max: 100 }, // requested
        gender: {
            type: String,
            enum: ["female", "male", "non_binary", "other", "prefer_not_to_say"],
        },

        phone: { type: String }, // requested
        languages: [{ type: String }], // ["English", "Romanian"]

        city: { type: String, required: true },
        online: { type: Boolean, default: false }, // available for online sessions

        priceRange: { type: String }, // "50-70 EUR"
        description: { type: String },
        yearsOfExperience: { type: Number, min: 0 },

        /* =====================
           PROFESSIONAL TYPE / STATUS
           (clinician / supervised / trainee etc.)
        ====================== */
        therapistType: {
            type: String,
            enum: [
                "clinical_psychologist",
                "psychotherapist",
                "counselor",
                "psychiatrist",
                "trainee_supervised", // "needs supervision"
                "other",
            ],
            required: true,
        },

        // Optional: licensing / college info
        licenseNumber: { type: String },
        professionalBody: { type: String }, // e.g. "COPSI"
        profilePhotoUrl: { type: String },

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
                    "ADHD",
                    "Eating disorders",
                    "Perfectionism",
                    "Social anxiety",
                ],
            },
        ],

        /* =====================
           THERAPEUTIC APPROACHES / MODALITIES
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
                    "Gestalt",
                    "DBT",
                    "EMDR",
                ],
            },
        ],

        /* =====================
           MATCHING – STYLE & FIT
           (the stuff you said is important)
        ====================== */

        // structured / unstructured etc.
        sessionStructure: {
            type: String,
            enum: ["structured", "semi", "free"],
            required: true,
        },

        // more direct vs more listening
        therapistActivity: {
            type: String,
            enum: ["active", "balanced", "listening"],
            required: true,
        },

        // conversational style
        communicationStyle: {
            type: String,
            enum: ["monologue", "questions", "mix"],
            required: true,
        },

        // client autonomy vs therapist pushes
        guidanceStyle: {
            type: String,
            enum: ["autonomous", "need_push", "mix"],
            required: true,
        },

        // focus: thoughts vs emotions
        focusStyle: {
            type: String,
            enum: ["thoughts", "emotions", "mix"],
            required: true,
        },

        // extra style dimensions you mentioned:
        directness: { type: Number, min: 0, max: 10, default: 5 }, // 0 gentle -> 10 very direct
        pace: { type: String, enum: ["slow", "medium", "fast"], default: "medium" },
        warmth: { type: Number, min: 0, max: 10, default: 6 },

        givesHomework: { type: Boolean, default: false },

        // “structured vs unstructured” as a clearer boolean too
        offersStructuredPrograms: { type: Boolean, default: false },

        /* =====================
           PRACTICAL DETAILS
        ====================== */
        worksWithHabits: { type: Boolean, default: false },
        acceptsOnlineOnly: { type: Boolean, default: false },

        ageGroups: [
            {
                type: String,
                enum: ["children", "teens", "adults", "seniors"],
            },
        ],

        /* =====================
           CREDENTIALS / UPLOADS
           (license + certificates)
        ====================== */
        // a quick “main proof” upload (license/attestation)
        primaryCredentialUrl: { type: String }, // required in UI; optional in DB if you want flexible

        // multiple documents (including CBT/ACT course certificates)
        credentials: [CredentialSchema],

        /* =====================
           DASHBOARD / OPERATIONS
           (for your later therapist dashboard)
        ====================== */
        // You can keep availability and appointments in separate collections,
        // but adding flags helps UI.
        onboardingCompleted: { type: Boolean, default: false },

        /* =====================
           META / VISIBILITY
        ====================== */
        isActive: { type: Boolean, default: true },
        isVerified: { type: Boolean, default: false }, // if you manually review docs
        verificationStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        rating: { type: Number, min: 1, max: 5 },
    },
    { timestamps: true }
);

export default mongoose.models.Therapist ||
mongoose.model("Therapist", TherapistSchema);
