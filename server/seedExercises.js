import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import Exercise from "./models/Exercise.js";

dotenv.config();

const seedExercises = async () => {
  try {
    // connect DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // read json
    const data = JSON.parse(
      fs.readFileSync("./exercises.json", "utf-8")
    );

    // insert exercises
    await Exercise.insertMany(data);
    console.log("Exercises seeded!");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedExercises();