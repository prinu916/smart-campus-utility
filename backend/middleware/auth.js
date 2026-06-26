const jwt = require("jsonwebtoken");
const User = require("../models/User");

const normalizeRole = (role, email) => {
  const normalizedEmail = (email || "").trim().toLowerCase();

  if (role === "admin" || normalizedEmail.includes("admin")) {
    return "admin";
  }

  return "student";
};

// ==========================================
// Protect Route Middleware
// ==========================================
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been disabled.",
      });
    }

    user.role = normalizeRole(user.role, user.email);
    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

// ==========================================
// Admin Only Middleware
// ==========================================
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (normalizeRole(req.user.role, req.user.email) !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }

  next();
};

// ==========================================
// Student Only Middleware
// ==========================================
const studentOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (normalizeRole(req.user.role, req.user.email) !== "student") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Student only.",
    });
  }

  next();
};

module.exports = {
  protect,
  adminOnly,
  studentOnly,
  admin: adminOnly,
};