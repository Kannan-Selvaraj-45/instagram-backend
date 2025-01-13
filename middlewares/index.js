const jwt = require("jsonwebtoken");

const authorize = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    if (!decoded || !decoded.id) {
      return res.status(400).json({ error: "Invalid token" });
    }

    req.user = decoded; // Attach decoded token info to req.user
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(400).json({ error: "Invalid or expired token" });
  }
};

module.exports = authorize;
