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
namespace.on("connection", async (socket) => {
  const userId = socket.handshake.auth.token;
  console.log( socket.id) 
  if(!userId) {return }
  const user = await users.findFirst({ where: { id: userId } });
  if (user) {
    await users.updateMany({
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


  socket.on("message" , ({content , socketId})=>{
    console.log(socketId , "here =======>id")
    io.to(socketId).emit("message" , content)
  })

  socket.on('typing-message',async (id) => {
    // console.log(id)
   const updated = await users.updateManyAndReturn({
      where: {
        id: Number(id),
      },
      data: {
        isOnline: "typing",
      },
    });
    console.log(updated)
    if(updated){

      io.emit("status","typing")
    }
  });

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
        isOnline: "offline",
      },
    });
    socket.broadcast.emit("user-status-changed", {
      userId,
      isOnline: "offline",
    });
  });


});
