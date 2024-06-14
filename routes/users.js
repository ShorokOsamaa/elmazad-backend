import { createUser, login, profile, signout } from "../controllers/users.js";
import { Router } from "express";
const router = Router();

// /api/v1/users
router.route("/signup").post(createUser);
router.route("/login").post(login);
router.route("/profile").get(profile);
router.route("/signout").post(signout);

export default router;
