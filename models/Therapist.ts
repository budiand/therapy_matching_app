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

/**
 * NEW: Agreements schema (no _id to keep it clean)
 */
const AgreementsSchema = new mongoose.Schema(
    {
        accepted: { type: Boolean, default: false },
        acceptedAt: { type: Date },
        version: { type: String }, // e.g. "2026-01-11"
        ip: { type: String },

        // Keep explicit commission % for clarity / audits
        commissionRate: { type: Number, default: 0.15 }, // 15%

        // Optional: store what exact documents were accepted + versions
        documents: [
            {
                key: {
                    type: String,
                    enum: ["service_agreement", "terms", "privacy"],
                    required: true,
                },
                version: { type: String, required: true },
            },
        ],
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
                    // Emotional health
                    "Anxiety",
                    "Depression",
                    "Panic attacks",
                    "Burnout",
                    "Stress",
                    "Sleep problems",
                    "Emotional regulation",
                    "Overthinking / rumination",

                    // Relationships
                    "Relationships",
                    "Family",
                    "Couples",
                    "Communication issues",
                    "Attachment / fear of abandonment",
                    "Conflict & boundaries",
                    "Social difficulties",
                    "Social anxiety",

                    // Identity & personal life
                    "Self-esteem",
                    "LGBTQ+",
                    "Gender identity",
                    "Meaning & life direction",
                    "Self-exploration",

                    // Professional life
                    "Career",
                    "Performance",
                    "Major decisions",
                    "Work-life balance",

                    // Behaviors
                    "Procrastination",
                    "Habits I want to change",
                    "Addictions",
                    "Anger management",

                    // Clinical / therapist topics
                    "Trauma",
                    "Grief",
                    "ADHD",
                    "Eating disorders",
                    "Perfectionism",
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
        ====================== */
        sessionStructure: {
            type: String,
            enum: ["structured", "semi", "free"],
            required: true,
        },

        therapistActivity: {
            type: String,
            enum: ["active", "balanced", "listening"],
            required: true,
        },

        communicationStyle: {
            type: String,
            enum: ["monologue", "questions", "mix"],
            required: true,
        },

        guidanceStyle: {
            type: String,
            enum: ["autonomous", "need_push", "mix"],
            required: true,
        },

        focusStyle: {
            type: String,
            enum: ["thoughts", "emotions", "mix"],
            required: true,
        },

        directness: { type: Number, min: 0, max: 10, default: 5 },
        pace: { type: String, enum: ["slow", "medium", "fast"], default: "medium" },
        warmth: { type: Number, min: 0, max: 10, default: 6 },

        givesHomework: { type: Boolean, default: false },
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
        ====================== */
        primaryCredentialUrl: { type: String },
        credentials: [CredentialSchema],

        /* =====================
           DASHBOARD / OPERATIONS
        ====================== */
        onboardingCompleted: { type: Boolean, default: false },

        /* =====================
           NEW: AGREEMENTS (required after signup)
        ====================== */
        agreements: { type: AgreementsSchema, default: () => ({}) },

        /* =====================
           META / VISIBILITY
        ====================== */
        isActive: { type: Boolean, default: true },
        isVerified: { type: Boolean, default: false },
        verificationStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        rating: { type: Number, min: 1, max: 5 },
    },
    { timestamps: true }
);

export default mongoose.models.Therapist || mongoose.model("Therapist", TherapistSchema);
