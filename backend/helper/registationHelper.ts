import {authenticator} from 'otplib'
import jwt from 'jsonwebtoken'
import {refreshTokenSecretKey,accessTokenSecretKey} from '../envVariables/envvariables'
import { tokenData } from '../types/interface'
import nodemailer from 'nodemailer'
import  {senderMail,senderMailPassword} from '../envVariables/envvariables'

function generateOtp():number{
    let otp = authenticator.generateSecret()
    const token = authenticator.generate(otp)
    return Number(token)
}

function generateToken(data:tokenData){
    const payload ={
      data
    }
      let accessToken = jwt.sign(payload,accessTokenSecretKey,{expiresIn:'5s'})
      let refreshToken = jwt.sign(payload,refreshTokenSecretKey,{expiresIn:'7d'})
      let token
    return  token={
        accessToken,
        refreshToken
      }
   
  }

  const sendOTP = async(email:string,otp:number):Promise<void>=>{
    const transporter = nodemailer.createTransport({
       service: 'gmail',
       auth: {
         user: senderMail,
         pass: senderMailPassword,
       },
    });
   
    const mailOptions = {
       from: senderMail,
       to: email,
       subject: 'Your OTP',
       text: `Your OTP is: ${otp}`,
    };
   
    await transporter.sendMail(mailOptions);
   }

  

export const registerHelper = {
    generateOtp,
    generateToken,
    sendOTP,
}