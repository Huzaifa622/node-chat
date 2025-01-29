import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const sendMessage = async(req:Request,res:Response,next:NextFunction) =>{
try {
   const {content , user , room} = req.body;
    const prisma = new PrismaClient();
    if(!content){
        return res.status(400).json({
            message:"Please type message"
        })
    }
    
    const newMessage = await prisma.message.create({
        data: {
          content,
          user: { connect: { id: user._id } }, 
          chatRoom: { connect: { id: room._id } }, 
        },
      });
    

      return res.status(200).json({
        message:"Messsage delivered",
        data:newMessage
      })


} catch (error) {
    console.log(error)
}
}