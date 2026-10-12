require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./db");
const authRoutes = require("./routes/authroute");
const detailsRoutes = require("./routes/detailsRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Employee Portal API is running.",
  });
});

app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");

    res.json({
      server: "ok",
      database: rows[0].ok === 1 ? "connected" : "unknown",
    });
  } catch (error) {
    console.error("Health check error:", error);

    res.status(500).json({
      server: "ok",
      database: "disconnected",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/details", detailsRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found.",
  });
});

app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);

  res.status(500).json({
    message: "Internal server error.",
  });
});

async function startServer() {
  try {
    await pool.query("SELECT 1");

    console.log("MySQL database connected.");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to MySQL.");
    console.error(error.message);
    process.exit(1);
  }
}

startServer();
