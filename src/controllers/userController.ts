import { NextFunction, Request, Response } from "express";
// import AsyncHandler from "../utils/asyncHandler.js";
import { PrismaClient } from "@prisma/client";
import { Descryption, Encryption } from "../utils/passwordEncryption.js";
import { tokenAssign } from "../utils/jwt.js";
import jwt from "jsonwebtoken"
// import Encryption from "../utils/passwordEncryption.js";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const prisma = new PrismaClient();
    const { name, email, password } = req.body;
    const hashP = await Encryption(password);
    const isAlreadyRegiter = await prisma.user.findMany({
      where: {
        email: email,
      },
    });
    // console.log(isAlreadyRegiter)
    if (isAlreadyRegiter.length != 0)
      return res.status(400).json({ message: "user already registered" });

    const user = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashP,
      },
    });

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prisma = new PrismaClient();
  const { name, email, password } = req.body;

  const foundUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!foundUser) {
    return res.status(404).json({ message: "user not found" });
  }

  const isMatch = await Descryption(password, foundUser.password);

  if (!isMatch) {
    return res.status(400).json({
      message: "incorrect password",
    });
  }

  const token = await tokenAssign(foundUser);

  return res
    .cookie("token", token, { httpOnly: true, secure: true ,sameSite: "none"   })
    .status(200)
    .json({
      email: foundUser.email ,
      name:foundUser.name,
    });
};
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  const  {token}  = req.cookies;
  
  
  console.log(token)
  
  res.clearCookie("token").status(201).json({
    message:"User logout successfully"
  }) 
  
  // const isMatch = await Descryption(password, foundUser.password);
  
  // if (!isMatch) {
    //   return res.status(400).json({
      //     message: "incorrect password",
      //   });
      // }
      
      // const token = await tokenAssign(foundUser);
      
      // return res
      //   .cookie("token", token, { httpOnly: true, secure: true ,sameSite: "strict" })
      //   .status(200)
      //   .json({
        //     email: foundUser.email ,
        //     name:foundUser.name
        //   });
      };
      
      export const getAllUsers = async (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        const prisma = new PrismaClient();
        const { name, email, password } = req.body;
      
        const foundUsers = await prisma.user.findMany();
        // if (!foundUser) {
        //   return res.status(404).json({ message: "user not found" });
        // }
      
        // const isMatch = await Descryption(password, foundUser.password);
      
        // if (!isMatch) {
        //   return res.status(400).json({
        //     message: "incorrect password",
        //   });
        // }
      
        // const token = await tokenAssign(foundUser);
      
        return res.status(200)
          .json({
          data: foundUsers
          });
      };