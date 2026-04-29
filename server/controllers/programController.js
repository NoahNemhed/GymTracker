import mongoose from "mongoose";
import Program from "../models/Program.js";

// create a program
export const createProgram = async (req, res) => {
  try {
    const { userId, name, description, goal, daysPerWeek, isActive, days } = req.body;

    if (!userId || !name || !goal || !daysPerWeek) {
      return res
        .status(400)
        .json({ message: "userId, name, goal and daysPerWeek are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // check if program with name already exists
    const existingProgram = await Program.findOne({
      userId,
      name: name.trim(),
    });

    if (existingProgram) {
      return res
        .status(409)
        .json({ message: "Program with this name already exists for this user" });
    }

    // if another program is active already set it as not active
    if (isActive === true) {
      await Program.updateMany(
        { userId: req.user.userId },
        { $set: { isActive: false } }
      );
    }

    // create program
    const program = await Program.create({
      userId,
      name,
      description,
      goal,
      daysPerWeek,
      isActive: isActive || false,
      days: days || [],
    });

    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ message: "Failed to create program" });
  }
};

// returns all programs
export const getPrograms = async (req, res) => {
  try {
    const { userId, isActive, goal } = req.query;
    const filter = {};

    if (userId) filter.userId = userId;
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (goal) filter.goal = goal;

    const programs = await Program.find(filter).sort({ createdAt: -1 });

    res.status(200).json(programs);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrive programs" });
  }
};

// get a program by id
export const getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.status(200).json(program);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrive program" });
  }
};

// update existing program
export const updateProgram = async (req, res) => {
  try {
    const { name, description, goal, daysPerWeek, isActive, days } = req.body;

    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    if (name !== undefined) program.name = name;
    if (description !== undefined) program.description = description;
    if (goal !== undefined) program.goal = goal;
    if (daysPerWeek !== undefined) program.daysPerWeek = daysPerWeek;
    if (isActive !== undefined) program.isActive = isActive;
    if (days !== undefined) program.days = days;

    const updatedProgram = await program.save();

    res.status(200).json(updatedProgram);
  } catch (error) {
    res.status(500).json({ message: "Failed to update program" });
  }
};

// Delete a program
export const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    await program.deleteOne();

    res.status(200).json({ message: "Program deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete program" });
  }
};


// set an program as active program ( deactivates other active programs )
export const setActiveProgram = async (req, res) => {
  try {
    const { id } = req.params;

    // deactivate all other programs for user
    await Program.updateMany(
      { userId: req.user.userId },
      { $set: { isActive: false } }
    );

    // activate selected program
    const program = await Program.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    res.status(200).json(program);
  } catch (error) {
    res.status(500).json({ message: "Failed to set active program" });
  }
};