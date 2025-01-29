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
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

httpServer.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});

const users = prisma.user;

const namespace = io.of("/chat");


//user connection
namespace.on("connection", async (socket) => {
  const userId = socket.handshake.auth.token;
  if(!userId) {return }
  const user = await users.findFirst({ where: { id: userId } });
  if (user) {
    await users.updateMany({
      where: {
        id: userId,
      },
      data: {
        isOnline: 1,
      },
    });

    socket.broadcast.emit("user-status-changed", {
      userId,
      isOnline: 1,
    });
  }

  //disconnection of user
  socket.on("disconnect", async () => {
    if (!userId) {
      console.log("User disconnected without an ID");
      return;
    }

    await users.updateManyAndReturn({
      where: {
        id: userId!,
      },
      data: {
        isOnline: 0,
      },
    });
    socket.broadcast.emit("user-status-changed", {
      userId,
      isOnline: 0,
    });
  });


});
