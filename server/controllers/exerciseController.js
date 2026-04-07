import Exercise from "../models/Exercise.js";

export const getExercises = async (req, res) => {
  try {
    const { muscle, type } = req.query;

    let filter = {};

    // Filter by primary muscle
    if (muscle) {
      filter.primaryMuscles = muscle;
    }

    // filter by exercise type e.g compound / isolation / conditioning.
    if (type) {
      filter.exerciseType = type;
    }

    const exercises = await Exercise.find(filter);

    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch exercises" });
  }
};

export const getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findOne({
      exerciseId: req.params.id,
    });

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    res.status(200).json(exercise);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch exercise" });
  }
};