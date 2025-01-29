import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
export interface CustomRequest extends Request {
    token: string | JwtPayload;
   }
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {token} = req.cookies;
   
      if (!token) {
        throw new Error();
      }
   
      const decoded = jwt.verify(token, "12345667");
      (req as CustomRequest).token = decoded;

   req.body.user = decoded
      next();
    } catch (err) {
      return res.status(400).json({message:"Token not found"})
    }
   };
   