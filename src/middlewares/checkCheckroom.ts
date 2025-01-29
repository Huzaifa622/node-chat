import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export const checkChatroom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const prisma = new PrismaClient();
    const { user1, user2 } = req.body;
    const alreadyHaveChatroom = await prisma.chatRoom.findFirst({
      where: {
        AND: [{ users: { some: user1 } }, { users: { some: user2 } }],
      },
    });

    if (alreadyHaveChatroom) {
        req.body.room = alreadyHaveChatroom
       next();
       return
    }
    const creatingChatroom =await prisma.chatRoom.create({
      data: {
        users: {
          connect: [{ id: user1 }, { id: user2 }],
        },
      },
    });

    if (creatingChatroom) {
        req.body.room = creatingChatroom
        next();
        return
    }
  } catch (error) {
    return res.json({ message: error });
  }
};
