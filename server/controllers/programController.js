import mongoose from "mongoose";
import Program from "../models/Program.js";

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

    const existingProgram = await Program.findOne({
      userId,
      name: name.trim(),
    });

    if (existingProgram) {
      return res
        .status(409)
        .json({ message: "Program with this name already exists for this user" });
    }

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