var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import AsyncHandler from "../utils/asyncHandler.js";
import { PrismaClient } from "@prisma/client";
import { Descryption, Encryption } from "../utils/passwordEncryption.js";
import { tokenAssign } from "../utils/jwt.js";
// import Encryption from "../utils/passwordEncryption.js";
export const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new PrismaClient();
        const { name, email, password } = req.body;
        const hashP = yield Encryption(password);
        const isAlreadyRegiter = yield prisma.user.findMany({
            where: {
                email: email,
            },
        });
        // console.log(isAlreadyRegiter)
        if (isAlreadyRegiter.length != 0)
            return res.status(400).json({ message: "user already registered" });
        const user = yield prisma.user.create({
            data: {
                email: email,
                name: name,
                password: hashP,
            },
        });
        return res.status(200).json({
            data: user,
        });
    }
    catch (error) {
        return res.status(400).json({ message: error });
    }
});
export const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new PrismaClient();
    const { name, email, password } = req.body;
    const foundUser = yield prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    if (!foundUser) {
        return res.status(404).json({ message: "user not found" });
    }
    const isMatch = yield Descryption(password, foundUser.password);
    if (!isMatch) {
        return res.status(400).json({
            message: "incorrect password",
        });
    }
    const token = yield tokenAssign(foundUser);
    return res
        .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
        .status(200)
        .json({
        email: foundUser.email,
        name: foundUser.name,
        token
    });
});
export const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.cookies;
    console.log(token);
    res.clearCookie("token").status(201).json({
        message: "User logout successfully"
    });
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
});
