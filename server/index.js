require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS status");
    return res.json({
      status: "ok",
      uptime: process.uptime(),
      dbConnected: rows.length > 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Database connection failed", error: error.message });
  }
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint không tồn tại" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Express Error:", err);
  res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ", error: err.message });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 NINETY EIGHT STUDIO API SERVER RUNNING ON PORT ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}/api/health`);
  console.log(`💾 Connected to VPS Database: ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}`);
  console.log(`===============================================`);
});
