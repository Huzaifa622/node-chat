
import express, { Request, Response } from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
export const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  cors({credentials: true, origin: 'https://chat-practice-one.vercel.app/'})
);


app.use("/api/v1", userRouter);


app.get("/", (req:Request, res:Response) => {
   console.log("first")
  return res.json("Hello from the root");
});
