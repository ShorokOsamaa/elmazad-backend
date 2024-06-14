import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createUser = async (req, res, next) => {
  res.send("TO DO POST /user/signup");
};

export const login = async (req, res, next) => {
  res.send("TO DO POST /user/login");
};

export const profile = async (req, res, next) => {
  res.send("TO DO GET /user/profile");
};

export const signout = async (req, res, next) => {
  res.send("TO DO GET /user/signout");
};
