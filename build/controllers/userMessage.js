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
import { prisma } from "../utils/db.js";
const sendMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, user, room } = req.body;
        const prisma = new PrismaClient();
        if (!content) {
            return res.status(400).json({
                message: "Please type message"
            });
        }
        const newMessage = yield prisma.message.create({
            data: {
                content,
                user: { connect: { id: user._id } },
                chatRoom: { connect: { id: room._id } },
            },
        });
        return res.status(200).json({
            message: "Messsage delivered",
            data: newMessage
        });
    }
    catch (error) {
        console.log(error);
    }
});
export const getAllMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { room } = req.body;
        const allMessages = yield prisma.message.findMany({
            where: {
                chatRoomId: room._id
            }
        });
        if (!allMessages) {
            return res.json({ message: "not found" });
        }
        // console.log(allMessages)
        return res.status(200).json({
            data: allMessages
        });
    }
    catch (error) {
        // console.log(error,"---------->")
        return res.status(400).json({
            data: error
        });
    }
});
