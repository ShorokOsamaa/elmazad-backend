import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors/custom-error.js";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createUser = async (req, res, next) => {
  const {
    name,
    email,
    password,
    phone,
    birthDate,
    gender,
    country,
    imagePaths,
  } = req.body;

  const userSearch = await prisma.user.findFirst({
    where: { OR: [{ email: email }, { phone: phone }] },
  });

  if (userSearch) {
    res
      .status(StatusCodes.CONFLICT)
      .json({ message: "Email or phone number already exist!" });
  } else {
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        password: passwordHash,
        email,
        phone,
        birthDate: new Date(birthDate),
        gender,
        country,
        ...(imagePaths !== null && imagePaths !== undefined && { imagePaths }),
      },
    });

    res.status(StatusCodes.CREATED).json({
      message: "User created successfuly",
      userId: newUser.id,
    });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Email and password are required." });
  }

  const userSearch = await prisma.user.findFirst({
    where: { email: email },
  });

  if (!userSearch) {
    // User does not exist
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User does not exist!" });
  } else {
    // User Exist
    const passwordHash = userSearch.password;

    if (await bcrypt.compare(password, passwordHash)) {
      // Authenticate / Generate Web Token
      const accessToken = jwt.sign(
        {
          id: userSearch.id,
          name: userSearch.name,
          email: userSearch.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "1h",
        }
      );

      // Response
      res.status(StatusCodes.CREATED).json({
        message: `${userSearch.name} is logged in!`,
        accessToken: accessToken,
      });
    } else {
      // Password Incorrect
      throw new UnauthenticatedError("Invalid credentials.");
    }
  }
};

export const profile = async (req, res, next) => {
  const { email } = req.user;

  if (!email) {
    throw new BadRequestError("Email is not provided");
  }

  const userSearch = await prisma.user.findFirst({
    where: { email: email },
    include: {
      items: true,
      bids: true,
      // wonAuctions: true,
    },
  });

  if (!userSearch) {
    throw new NotFoundError("User not found");
  }

  const { password, ...userData } = userSearch;

  res.status(StatusCodes.OK).json({
    message: "User profile retrieved successfully",
    user: userData,
  });
};

export const updateUser = async (req, res, next) => {
  const { email } = req.user;
  const { name, phone, birthDate, gender, country, city, imagePaths } =
    req.body;

  if (!email) {
    throw new BadRequestError("Email is not provided");
  }

  const userSearch = await prisma.user.findFirst({
    where: { email: email },
  });

  if (!userSearch) {
    throw new NotFoundError("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { email: email },
    data: {
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone }),
      ...(birthDate !== undefined && { birthDate: new Date(birthDate) }),
      ...(gender !== undefined && { gender }),
      ...(country !== undefined && { country }),
      ...(city !== undefined && { city }),
      ...(imagePaths !== undefined && { imagePaths }),
    },
  });

  const { password, ...userData } = updatedUser;

  res.status(StatusCodes.OK).json({
    message: "User profile updated successfully",
    user: userData,
  });
};

export const getUserById = async (req, res, next) => {
  const id = req.params.id;

  const userSearch = await prisma.user.findFirst({
    where: { id: id },
    include: {
      items: true,
      bids: true,
    },
  });

  if (!userSearch) {
    throw new NotFoundError("User not found");
  }

  const { password, ...userData } = userSearch;

  res.status(StatusCodes.OK).json({
    message: "User profile retrieved successfully",
    user: userData,
  });
};
