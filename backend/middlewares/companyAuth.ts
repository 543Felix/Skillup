import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { refreshTokenSecretKey, accessTokenSecretKey } from '../envVariables/envvariables';
import { registerHelper } from "../helper/registationHelper";
import Company from '../models/companySchema'

const isCompanyLoggedIn = async (req: Request, res: Response, next: NextFunction) =>{
  const token = req.cookies.companyAccessToken;
  if (!token) {
    return res.status(401).send({ message: 'Token not provided' });
  }
  try {
    const tokenVerified = jwt.verify(token, accessTokenSecretKey);
    if (tokenVerified) {
     let isBlocked:boolean =  await isCompanyBlocked((tokenVerified as JwtPayload))
      if(isBlocked===false){
         next();
      }else{
           res.clearCookie('companyAccessToken')
            res.clearCookie('companyRefreshToken')
      return  res.status(403).json({message:'user is blocked'})
      }
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      let refreshToken = req.cookies.companyRefreshToken;
      if (!refreshToken) {
        return res.status(401).send({ message: 'Refresh token not provided' });
      }
      try {
        const refreshTokenVerified = jwt.verify(refreshToken, refreshTokenSecretKey);
        
        if (refreshTokenVerified) {
          let isBlocked:boolean = await isCompanyBlocked((refreshTokenVerified as JwtPayload))
          if(isBlocked === false){
           const token = registerHelper.generateToken((refreshTokenVerified as JwtPayload).data )
          res.cookie('companyAccessToken',token.accessToken,{httpOnly:true})
          next()
          }else{
            res.clearCookie('companyAccessToken')
            res.clearCookie('companyRefreshToken')
            return res.status(403).send('user is blocked')
          }
        }
      } catch (refreshError) {
         return  res.status(401).send({ message: "Session expired please login" });
      }
    } else {
     return res.status(401).send({ message: "Session expired please login" })
    }
  }
}

const isCompanyBlocked = async (data: JwtPayload): Promise<boolean> => {
  try {
    const company = await Company.findOne({ name: data.name, email: data.email, isBlocked: false });
    console.log('company data = ',company)
    if(company?.isBlocked===false){
      return false
    }else{
      return true
    }
  } catch (error) {
    return true;
  }
};

export default isCompanyLoggedIn