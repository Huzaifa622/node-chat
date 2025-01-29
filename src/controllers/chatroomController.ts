import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient(); // Create a single instance of PrismaClient

export const createChatroom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user1, user2 } = req.body;

    // Validate if both users exist
    const user1Exists = await prisma.user.findUnique({
      where: { id: user1 },
    });

    const user2Exists = await prisma.user.findUnique({
      where: { id: user2 },
    });

    if (!user1Exists || !user2Exists) {
      return res.status(404).json({
        message: "One or both users do not exist",
      });
    }

    // Check if a chatroom already exists with both users
    const alreadyHaveChatroom = await prisma.chatRoom.findFirst({
      where: {
        AND: [
          { users: { some: { id: user1 } } },
          { users: { some: { id: user2 } } },
        ],
      },
    });

    if (alreadyHaveChatroom) {
      return res.json({
        message: "Chatroom already exists",
        data: alreadyHaveChatroom,
      });
    }

    // Create a new chatroom
    const creatingChatroom = await prisma.chatRoom.create({
      data: {
        users: {
          connect: [{ id: user1 }, { id: user2 }],
        },
      },
    });

    return res.json({
      message: "Chatroom created successfully",
      data: creatingChatroom,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};