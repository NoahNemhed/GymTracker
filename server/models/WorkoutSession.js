import mongoose from "mongoose";

const workoutSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },
    dayId: {
      type: String,
      required: true,
    },
    dayName: {
      type: String,
      required: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    exercises: [
      {
        exerciseId: {
          type: String,
          required: true,
        },
        targetSets: {
          type: Number,
          required: true,
        },
        completedSets: {
          type: Number,
          required: true,
        },
        repRange: {
          type: String,
          required: true,
        },
        restSeconds: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("WorkoutSession", workoutSessionSchema);