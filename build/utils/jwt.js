var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
export const tokenAssign = function (user) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const token = jwt.sign({ _id: (_a = user.id) === null || _a === void 0 ? void 0 : _a.toString(), name: user.name }, "12345667", {
            expiresIn: '2 days',
        });
        return token;
    });
};
// export const verifyToken = async function (token: string){
// const decode = jwt.verify(token , "12345667")
//   return decode
// }
