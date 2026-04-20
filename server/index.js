import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import programRoutes from "./routes/programRoutes.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/exercises", exerciseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/programs", programRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});