import authenticateToken from "../middleware/authenticateToken.js";
import { Router } from "express";
const router = Router();

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notifications.js";

// Routes
router.route("/").get(authenticateToken, getNotifications);
router.route("/:id/read").patch(authenticateToken, markNotificationAsRead);
router.route("/read-all").patch(authenticateToken, markAllNotificationsAsRead);

export default router;
