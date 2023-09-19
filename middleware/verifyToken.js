const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
};

const verifyTokenSuperAdmin = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    console.log(decoded.role);
    if (decoded.role !== "superadmin") {
      return res.status(401).json({
        meta: {
          status: 401,
          message: "hanya dapat di akses oleh super admin",
        },
      });
    }
    req.user = decoded;
    next();
  });
};

const verifyTokenAdmin = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    console.log(decoded.role);
    if (decoded.role === "admin" || decoded.role === "superadmin") {
      req.user = decoded;
      next();
    } else {
      return res.status(401).json({
        meta: {
          status: 401,
          message: "hanya dapat di akses oleh admin atau superadmin",
        },
      });
    }
  });
};

module.exports = { verifyToken, verifyTokenSuperAdmin, verifyTokenAdmin };
