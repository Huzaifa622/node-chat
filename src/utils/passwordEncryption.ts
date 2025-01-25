import bcrypt from "bcrypt"
export const Encryption =async function( password:string){
const hashPassword = await bcrypt.hash(password , 8);
return hashPassword;
}
export const Descryption =async function( password:string ,userPassword:string ){
const isMatch =  bcrypt.compareSync(  password , userPassword);
return isMatch;
}

