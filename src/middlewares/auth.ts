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
   
      next();
    } catch (err) {
      res.status(401).send('Please authenticate');
    }
   };
   