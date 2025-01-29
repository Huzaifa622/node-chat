// import express from "express";
import dotenv from "dotenv";
import { app } from "./app.js";
import {createServer} from "http"
import { Server } from "socket.io";
import { prisma } from "./utils/db.js";
import { getAllUsers } from "./controllers/userController.js";
dotenv.config();

const httpServer = createServer(app)
const io = new Server(httpServer,{ cors: {
  origin: "http://localhost:5173",
  methods: ["GET", "POST"]
}});

httpServer.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});

  const users = prisma.user;

  const namespace = io.of("/chat")

  namespace.on("connection",async (socket) => {

    const userId = socket.handshake.auth.token
    const user = await users.findFirst({where:{id:userId}});
      // console.log(user)

      if(user){
   await users.updateMany({
        where:{
          id: userId,
        },
        data:{
         isOnline:1
        }
      });
      
      socket.broadcast.emit("user-status-changed", {
        userId,
        isOnline: 1
      });
}
    // })
    socket.on("disconnect" , async()=>{

      console.log("new user disconnected")
      console.log(userId,"-------------<user id")

      if (!userId) {
        console.log("User disconnected without an ID");
        return; // Exit if no userId
      }
    const updatedUser  =  await users.updateManyAndReturn({
        where:{
          id: userId!,
        },
        data:{
         isOnline:0
        }
      })

      console.log("Updated user:", updatedUser);

      socket.broadcast.emit("user-status-changed", {
        userId,
        isOnline: 0
      });
    })
  });

