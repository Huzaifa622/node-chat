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
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    },
});
httpServer.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});
const users = prisma.user;
const namespace = io.of("/chat");
//user connection
namespace.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = socket.handshake.auth.token;
    console.log(socket.id);
    if (!userId) {
        return;
    }
    const user = yield users.findFirst({ where: { id: userId } });
    if (user) {
        yield users.updateMany({
            where: {
                id: userId,
            },
            data: {
                isOnline: "online",
            },
        });
        socket.broadcast.emit("user-status-changed", {
            userId,
            isOnline: "online",
        });
    }
    socket.on("message", ({ content, socketId }) => {
        console.log(socketId, "here =======>id");
        io.to(socketId).emit("message", content);
    });
    socket.on('typing-message', (id) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log(id)
        const updated = yield users.updateManyAndReturn({
            where: {
                id: Number(id),
            },
            data: {
                isOnline: "typing",
            },
        });
        console.log(updated);
        if (updated) {
            io.emit("status", "typing");
        }
    }));
    //disconnection of user
    socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
        if (!userId) {
            console.log("User disconnected without an ID");
            return;
        }
        yield users.updateManyAndReturn({
            where: {
                id: userId,
            },
            data: {
                isOnline: "offline",
            },
        });
        socket.broadcast.emit("user-status-changed", {
            userId,
            isOnline: "offline",
        });
    }));
}));
