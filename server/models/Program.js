import mongoose from "mongoose";

const programExerciseSchema = new mongoose.Schema(
  {
    exerciseId: {
      type: String,
      required: true,
      trim: true,
    },
    targetSets: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    repRange: {
      type: String,
      required: true,
      trim: true,
    },
    restSeconds: {
      type: Number,
      required: true,
      min: 15,
      max: 600,
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: true }
);

const programDaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    focus: {
      type: String,
      required: true,
      trim: true,
    },
    dayOrder: {
      type: Number,
      required: true,
      min: 1,
    },
    exercises: {
      type: [programExerciseSchema],
      default: [],
    },
  },
  { _id: true }
);

const programSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },
    goal: {
      type: String,
      enum: ["hypertrophy", "strength", "endurance", "general_fitness"],
      required: true,
    },
    daysPerWeek: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    days: {
      type: [programDaySchema],
      default: [],
      validate: {
        validator: function (value) {
          return value.length <= 7;
        },
        message: "A program can have at most 7 days",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Program", programSchema);