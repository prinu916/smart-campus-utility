const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign(
    {
      id,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

const normalizeCode = (value) => (value || "").trim().toLowerCase();

const getConfiguredAdminCode = () => normalizeCode(process.env.ADMIN_ACCESS_CODE || process.env.ADMIN_CODE || "");

const resolveUserRole = (role, email, adminCode, storedAdminCode) => {
  const normalizedEmail = (email || "").trim().toLowerCase();
  const normalizedAdminCode = normalizeCode(adminCode);
  const normalizedStoredCode = normalizeCode(storedAdminCode);
  const configuredAdminCode = getConfiguredAdminCode();
  const isAdminEmail = normalizedEmail.includes("admin");
  const isAdminCodeMatch = Boolean(normalizedAdminCode) && (normalizedAdminCode === normalizedStoredCode || normalizedAdminCode === configuredAdminCode);

  if (role === "admin" || isAdminEmail || isAdminCodeMatch) {
    return "admin";
  }

  return "student";
};

const isValidAdminCode = async (adminCode) => {
  const normalizedCode = normalizeCode(adminCode);

  if (!normalizedCode) return false;

  const configuredAdminCode = getConfiguredAdminCode();
  if (normalizedCode === configuredAdminCode) return true;

  const existingAdmin = await User.findOne({ role: "admin", adminCode: normalizedCode });
  return Boolean(existingAdmin);
};

const isAdminAccessAllowed = (user, providedCode) => {
  const normalizedProvidedCode = normalizeCode(providedCode);
  const configuredAdminCode = getConfiguredAdminCode();
  const storedAdminCode = normalizeCode(user?.adminCode);

  if (user?.role === "admin") {
    return Boolean(normalizedProvidedCode && (normalizedProvidedCode === storedAdminCode || normalizedProvidedCode === configuredAdminCode));
  }

  return Boolean(normalizedProvidedCode && (normalizedProvidedCode === storedAdminCode || normalizedProvidedCode === configuredAdminCode));
};

const isValidEmail = (email) => {
  const normalizedEmail = (email || "").trim().toLowerCase();
  const collegeDomain = "college.edu";
  const emailRegex = /^([a-z0-9._-]+)@college\.edu$/i;

  if (typeof email !== "string") return false;

  if (!emailRegex.test(normalizedEmail)) return false;

  const localPart = normalizedEmail.split("@")[0];

  return localPart.length >= 4 && /^[a-z0-9._-]+$/.test(localPart);
};

// ==============================
// Register User
// POST /api/auth/register
// ==============================
const registerUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      rollNumber,
      department,
      semester,
      phone,
      role,
      adminCode,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, Email and Password are required.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });

    if (exists) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    let userRole = resolveUserRole(role, email, adminCode);

    if (role === "admin") {
      const isApprovedAdmin = await isValidAdminCode(adminCode);
      if (!isApprovedAdmin) {
        return res.status(403).json({
          message: "Invalid admin access code.",
        });
      }
      userRole = "admin";
    }

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      role: userRole,
      adminCode: adminCode ? normalizeCode(adminCode) : "",
      rollNumber,
      department,
      semester,
      phone,
      lastLogin: new Date(),
    });

    return res.status(201).json({
      success: true,

      token: generateToken(user._id, user.role),

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        department: user.department,
        semester: user.semester,
        phone: user.phone,
        avatarColor: user.avatarColor,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ==============================
// Login User
// POST /api/auth/login
// ==============================
const loginUser = async (req, res, next) => {
  try {
    const { email, password, adminCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Account disabled by admin.",
      });
    }

    if (user.role === "admin") {
      const normalizedAdminCode = normalizeCode(adminCode);
      const configuredAdminCode = getConfiguredAdminCode();
      const storedAdminCode = normalizeCode(user.adminCode);

      if (!storedAdminCode && !configuredAdminCode) {
        return res.status(403).json({ message: "Admin access code is required." });
      }

      if (!isAdminAccessAllowed(user, adminCode)) {
        return res.status(403).json({ message: "Invalid admin access code." });
      }
    }

    const matched = await user.matchPassword(password);

    if (!matched) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const resolvedRole = resolveUserRole(user.role, user.email, adminCode, user.adminCode);

    if (user.role !== resolvedRole) {
      user.role = resolvedRole;
    }

    user.lastLogin = new Date();

    await user.save();

    return res.json({
      success: true,

      token: generateToken(user._id, user.role),

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        department: user.department,
        semester: user.semester,
        phone: user.phone,
        avatarColor: user.avatarColor,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ==============================
// Current User
// GET /api/auth/me
// ==============================
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// ==============================
// Get All Users (Admin)
// ==============================
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    next(err);
  }
};

// ==============================
// Delete User (Admin)
// ==============================
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  deleteUser,
};