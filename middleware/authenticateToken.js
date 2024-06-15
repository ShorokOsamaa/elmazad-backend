import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/custom-error.js";
import dotenv from "dotenv";
dotenv.config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return next(new UnauthenticatedError("No token provided"));

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err)
      return next(
        new UnauthenticatedError(
          "Not authorized to access this route - Invalid Token"
        )
      );

    req.user = user;
    next();
  });
};

export default authenticateToken;
