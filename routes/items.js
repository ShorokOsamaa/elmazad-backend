import { Router } from "express";
const router = Router();

import {
  getAllItems,
  addNewItem,
  getProductById,
  deleteItem,
  updateItem,
  getItemBids,
  addBid,
} from "../controllers/items.js";

// Routes
router.route("/").get(getAllItems).post(addNewItem);

router.route("/:id").get(getProductById).delete(deleteItem).patch(updateItem);

router.route("/:id/bid").get(getItemBids).post(addBid);

export default router;
