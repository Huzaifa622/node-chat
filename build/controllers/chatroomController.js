var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient(); // Create a single instance of PrismaClient
export const createChatroom = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user1, user2 } = req.body;
        // Validate if both users exist
        const user1Exists = yield prisma.user.findUnique({
            where: { id: user1 },
        });
        const user2Exists = yield prisma.user.findUnique({
            where: { id: user2 },
        });
        if (!user1Exists || !user2Exists) {
            return res.status(404).json({
                message: "One or both users do not exist",
            });
        }
        // Check if a chatroom already exists with both users
        const alreadyHaveChatroom = yield prisma.chatRoom.findFirst({
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
        const creatingChatroom = yield prisma.chatRoom.create({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error,
        });
    }
});
