import authenticateToken from "../middleware/authenticateToken.js";
import { Router } from "express";
const router = Router();

import {
  getAllItems,
  addNewItem,
  getItemById,
  getItemsByCategory,
  deleteItem,
  updateItem,
  getItemBids,
  addBid,
} from "../controllers/items.js";

// Routes
router.route("/").get(getAllItems).post(authenticateToken, addNewItem);

router.route("/:id").get(getItemById).delete(deleteItem).patch(updateItem);

router.route("/category/:category").get(getItemsByCategory);

router.route("/:id/bid").get(getItemBids).post(authenticateToken, addBid);

export default router;
