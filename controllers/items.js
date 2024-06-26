import StatusCodes from "http-status-codes";
import {
  NotFoundError,
  UnprocessableEntityError,
} from "../errors/custom-error.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllItems = async (req, res, next) => {
  const items = await prisma.item.findMany();
  res
    .status(StatusCodes.OK)
    .json({ message: "success", count: items.length, items });
};

export const addNewItem = async (req, res, next) => {
  res.send("TO DO POST /items");
};

export const getItemById = async (req, res, next) => {
  const id = req.params.id;

  const item = await prisma.item.findFirst({
    where: { id: id },
    include: {
      bids: true,
    },
  });
  res.status(StatusCodes.OK).json({ message: "success", item });
};

export const getItemsByCategory = async (req, res, next) => {
  const category = req.params.category;

  try {
    const items = await prisma.item.findMany({
      where: {
        category: category.toLowerCase(),
      },
    });

    res
      .status(StatusCodes.OK)
      .json({ message: "success", count: items.length, items });
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req, res, next) => {
  res.send("TO DO DELETE /items/:id");
};

export const updateItem = async (req, res, next) => {
  res.send("TO DO PATCH /items/:id");
};

export const getItemBids = async (req, res, next) => {
  res.send("TO DO POST /items/:id/bid");
};

export const addBid = async (req, res, next) => {
  const itemId = req.params.id;
  const userId = req.user.id;
  const { amount } = req.body;

  const item = await prisma.item.findFirst({
    where: { id: itemId },
    include: {
      bids: true,
    },
  });

  const bids = item.bids;
  const highestBid = bids.reduce(
    (max, bid) => (bid.amount > max.amount ? bid : max),
    bids[0]
  );

  // Validations
  if (!itemId || !item) {
    throw new NotFoundError("Item not found");
  }
  if (!userId) {
    throw new BadRequestError("Authntication is required");
  }
  if (userId === item.sellerId) {
    throw new UnprocessableEntityError("Users can't bid on thier items");
  }
  if (highestBid && amount <= highestBid.amount) {
    throw new UnprocessableEntityError(
      "The entered amount is less than the minimum allowed bid"
    );
  }

  // Add bid to the database
  const newBid = await prisma.bid.create({
    data: {
      itemId,
      userId,
      amount,
      placedAt: new Date(),
    },
  });

  const updatedItem = await prisma.item.update({
    where: { id: itemId },
    data: {
      winningBidId: newBid.id,
      winnerId: newBid.userId,
    },
  });

  // Response
  res
    .status(StatusCodes.CREATED)
    .json({ message: "success", bid: newBid, item: updatedItem });
};
