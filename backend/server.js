const fs = require("fs");
const path = require("path");

// Load .env
const envPath = path.join(__dirname, ".env");

console.log("📂 Current Directory:", __dirname);
console.log("📄 .env Path:", envPath);
console.log("✅ .env Exists:", fs.existsSync(envPath));

require("dotenv").config({ path: envPath });

console.log("🔑 MONGO_URI:", process.env.MONGO_URI ? "Loaded ✅" : "Not Loaded ❌");
console.log("🌐 CLIENT_URL:", process.env.CLIENT_URL);
console.log("🚀 PORT:", process.env.PORT);

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const noteRoutes = require("./routes/noteRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const supportRoutes = require("./routes/supportRoutes");

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
  })
);

app.use(express.json());

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Smart Campus API Running",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/support", supportRoutes);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});