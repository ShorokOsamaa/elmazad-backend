import StatusCodes from "http-status-codes";
import {
  NotFoundError,
  UnprocessableEntityError,
  ServerError,
} from "../errors/custom-error.js";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getNotifications = async (req, res) => {
  const userId = req.user.id;

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(StatusCodes.OK).json({ message: "success", notifications });
  } catch (error) {
    throw new ServerError("Error fetching notifications");
  }
};

export const markNotificationAsRead = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const notification = await prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });

    res.status(StatusCodes.OK).json({ message: "success", notification });
  } catch (error) {
    throw new ServerError("Error marking notification as read");
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  const userId = req.user.id;

  try {
    const notifications = await prisma.notification.updateMany({
      where: { userId },
      data: { isRead: true },
    });

    res.status(StatusCodes.OK).json({ message: "success", notifications });
  } catch (error) {
    throw new ServerError("Error marking all notifications as read");
  }
};
