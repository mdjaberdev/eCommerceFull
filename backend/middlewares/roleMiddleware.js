const jwt = require("jsonwebtoken");

const userMiddleware = (req, res, next) => {
  const authorizationToken = req.headers.authorization;
  const token = authorizationToken.split(" ")[1];

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Please enter your token",
    });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  } else {
    next();
  }
};

const adminMiddleware = (req, res, next) => {
  const authorizationToken = req.headers.authorization;
  const token = authorizationToken.split(" ")[1];
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Please enter your token",
    });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS);

  if (decoded.role !== "admin") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  } else {
    next();
  }
};
const vendorMiddleware = (req, res, next) => {
  const authorizationToken = req.headers.authorization;
  const token = authorizationToken.split(" ")[1];
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Please enter your token",
    });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS);

  if (decoded.role == "admin" || decoded.role == "vendor") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Unauthorized",
  });
};

module.exports = { userMiddleware, adminMiddleware, vendorMiddleware };
