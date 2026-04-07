import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    exerciseId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    aliases: {
      type: [String],
      default: [],
    },
    exerciseType: {
      type: String,
      required: true,
      enum: ["compound", "isolation", "bodyweight", "conditioning"],
    },
    equipmentRequired: {
      type: [String],
      default: [],
    },
    primaryMuscles: {
      type: [String],
      default: [],
    },
    secondaryMuscles: {
      type: [String],
      default: [],
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    imageUrl: {
      type: String,
      default: "",
    },
    gifUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Exercise", exerciseSchema);