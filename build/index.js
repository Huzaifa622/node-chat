var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import express from "express";
import dotenv from "dotenv";
import { app } from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { prisma } from "./utils/db.js";
dotenv.config();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    } });
httpServer.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});
const users = prisma.user;
const namespace = io.of("/chat");
namespace.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = socket.handshake.auth.token;
    const user = yield users.findFirst({ where: { id: userId } });
    // console.log(user)
    if (user) {
        yield users.updateMany({
            where: {
                id: userId,
            },
            data: {
                isOnline: 1
            }
        });
        socket.broadcast.emit("user-status-changed", {
            userId,
            isOnline: 1
        });
    }
    // })
    socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("new user disconnected");
        console.log(userId, "-------------<user id");
        if (!userId) {
            console.log("User disconnected without an ID");
            return; // Exit if no userId
        }
        const updatedUser = yield users.updateManyAndReturn({
            where: {
                id: userId,
            },
            data: {
                isOnline: 0
            }
        });
        console.log("Updated user:", updatedUser);
        socket.broadcast.emit("user-status-changed", {
            userId,
            isOnline: 0
        });
    }));
}));
