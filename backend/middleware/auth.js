const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    // =========================================
    // GET AUTH HEADER
    // =========================================
    const authHeader = req.headers.authorization;

    // =========================================
    // VALIDASI HEADER
    // =========================================
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // =========================================
    // VALIDASI FORMAT BEARER
    // =========================================
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    // =========================================
    // LANJUT
    // =========================================
    next();
  } catch (error) {
    console.log("AUTH ERROR :", error);

    // =========================================
    // TOKEN INVALID
    // =========================================
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

module.exports = auth;
