import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import StatusCodes from "http-status-codes";

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
  res.send("TO DO POST /items/:id/bid");
};
