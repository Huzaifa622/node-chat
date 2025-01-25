// import express from "express";
import dotenv from "dotenv";
import { app } from "./app.js";
import {createServer} from "http"
import { Server } from "socket.io";
dotenv.config();

const httpServer = createServer(app)
const io = new Server(httpServer);

httpServer.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});
io.on("connection", (socket) => {
  // console.log(socket.id); 
  socket.broadcast.emit("hello", "world");
  socket.on("connect" , ()=>{
    console.log("new user connected")
  })
  socket.on("disconnect" , ()=>{
    console.log("new user disconnected")
  })
});

