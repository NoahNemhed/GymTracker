import WorkoutSession from "../models/WorkoutSession.js";
import mongoose from "mongoose";

export const createWorkoutSession = async (req, res) => {
  try {
    const { programId, dayId, dayName, exercises } = req.body;

    if (!programId || !dayId || !dayName || !exercises) {
      return res.status(400).json({
        message: "programId, dayId, dayName and exercises are required",
      });
    }

    const workoutSession = await WorkoutSession.create({
      userId: req.user.userId,
      programId,
      dayId,
      dayName,
      exercises,
    });

    res.status(201).json(workoutSession);
  } catch (error) {
    console.error("Create workout session error:", error);
    res.status(500).json({ message: "Failed to save workout session" });
  }
};

export const getWorkoutSessions = async (req, res) => {
  try {
    const workoutSessions = await WorkoutSession.find({
      userId: req.user.userId,
    })
      .populate("programId", "name goal")
      .sort({ completedAt: -1 });

    res.status(200).json(workoutSessions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch workout sessions" });
  }
};

export const getWorkoutStats = async (req, res) => {
  try {
    const [stats] = await WorkoutSession.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.userId),
        },
      },
      {
        $unwind: "$exercises",
      },
      {
        $group: {
          _id: "$userId",
          totalWorkouts: { $addToSet: "$_id" },
          totalCompletedSets: { $sum: "$exercises.completedSets" },
          totalTargetSets: { $sum: "$exercises.targetSets" },
        },
      },
      {
        $project: {
          _id: 0,
          totalWorkouts: { $size: "$totalWorkouts" },
          totalCompletedSets: 1,
          totalTargetSets: 1,
        },
      },
    ]);

    res.status(200).json(
      stats || {
        totalWorkouts: 0,
        totalCompletedSets: 0,
        totalTargetSets: 0,
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch workout stats" });
  }
};
