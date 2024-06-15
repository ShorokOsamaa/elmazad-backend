import {
  createUser,
  login,
  profile,
  getUserById,
  updateUser,
} from "../controllers/users.js";
import { Router } from "express";
import authenticateToken from "../middleware/authenticateToken.js";
const router = Router();

// /api/v1/users
router.route("/signup").post(createUser);
router.route("/login").post(login);
router
  .route("/profile")
  .get(authenticateToken, profile)
  .patch(authenticateToken, updateUser);
router.route("/:id").get(getUserById);

export default router;
