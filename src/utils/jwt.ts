
import jwt from "jsonwebtoken"
export const tokenAssign = async function (user: {
    name: string;
    id: number;
    email: string;
    password: string;
}){
const token = jwt.sign({ _id: user.id?.toString(), name: user.name }, "12345667", {
    expiresIn: '2 days',
  })
  return token
}

// export const verifyToken = async function (token: string){
// const decode = jwt.verify(token , "12345667")
//   return decode
// }