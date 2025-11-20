// const jwt = require("jsonwebtoken");
// module.exports = (req, res, next) => {
//   const header = req.header("Authorization");
//   if (!header) return res.status(401).json({ message: "No token" });
//   const token = header.split(" ")[1]; // "Bearer <token>"
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.id;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };



// server/middleware/authMiddleware.js
// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   const header = req.header("Authorization") || req.header("authorization");
//   if (!header) return res.status(401).json({ message: "No token provided" });

//   // Accept: "Bearer <token>" or just "<token>"
//   const parts = header.split(" ");
//   const token = parts.length === 2 && parts[0].toLowerCase() === "bearer" ? parts[1] : parts[0];

//   if (!token) return res.status(401).json({ message: "Invalid token format" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.id;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };
// server/middleware/authmiddleware.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header) return res.status(401).json({ message: "No authorization header" });

    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const secret = process.env.JWT_SECRET || "your_jwt_secret_here";
    const decoded = jwt.verify(token, secret);
    // decoded should contain user id (depends on your auth)
    // adapt these lines if your token uses different field (e.g. decoded.userId)
    req.userId = decoded.id || decoded.userId || decoded._id;
    next();
  } catch (err) {
    console.error("authmiddleware error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};
