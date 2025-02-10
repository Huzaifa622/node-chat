
import express, { Request, Response } from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import chatRouter from "./routes/chat.route.js";
import { prisma } from "./utils/db.js";
import msgRouter from "./routes/message.route.js";

export const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  cors({credentials: true, origin: 'http://localhost:3000'})
);


app.use("/api/v1", userRouter , chatRouter , msgRouter);
// app.use("/api/v1", );


app.get("/", (req:Request, res:Response) => {
   console.log("first")
  return res.json("Hello from the root");
});
