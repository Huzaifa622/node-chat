var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcrypt";
export const Encryption = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashPassword = yield bcrypt.hash(password, 8);
        return hashPassword;
    });
};
export const Descryption = function (password, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const isMatch = bcrypt.compareSync(password, userPassword);
        return isMatch;
    });
};
