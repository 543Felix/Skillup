import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  refreshTokenSecretKey,
  accessTokenSecretKey,
} from "../envVariables/envvariables";
import { registerHelper } from "../helper/registationHelper";
import Developer from "../models/developerSchema";




const devAuthorization = async(req: Request,res: Response,next: NextFunction) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: "Session expired please login" });
  }
  try {
    const tokenVerified = jwt.verify(token, accessTokenSecretKey);
    if (tokenVerified) {
      let isBlocked:boolean =  await isDeveloperBlocked((tokenVerified as JwtPayload).data)
      if(isBlocked===false){
         next();
      }else{
      return  res.status(403).json({message:'user is blocked'})
      }
    
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      let refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).send({ message: "Session expired please login" });
      }
      try {
        const refreshTokenVerified = jwt.verify(
          refreshToken,
          refreshTokenSecretKey
        );

        if (refreshTokenVerified) {
          let isBlocked:boolean =  await isDeveloperBlocked((refreshTokenVerified as JwtPayload).data)
          if(isBlocked === false){
            const token = registerHelper.generateToken(
            (refreshTokenVerified as JwtPayload).data
          );
          res.cookie("accessToken", token.accessToken, { httpOnly: true });
          next();
          }else{
            res.clearCookie('accessToken')
            res.clearCookie('refreshToken')
            return res.status(403).send('user is blocked')
          }
        
        }
      } catch (refreshError) {
       return  res.status(401).send({ message: "Session expired please login" });
      }
    } else {
     return res.status(401).send({ message: "Session expired please login" });
    }
  }
};

const isDeveloperBlocked = async (data: JwtPayload): Promise<boolean> => {
  try {
    const developer = await Developer.findOne({ name: data.name, email: data.email});
        return developer!.isBlocked; 
  

  } catch (error) {
    return false;
  }
};

export default devAuthorization;
