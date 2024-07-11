import { ObjectId } from "mongodb"


interface developerData{
    _id:ObjectId
    name:string,
    email:string,
    phoneNo:number,
    password:string,
    isBlocked?:boolean,
    image:string
}

interface adminSideListingData{
    name:string,
    email:string,
    isVerified?:boolean,
    isBlocked?:boolean
    
}

interface companyData{
    _id:ObjectId,
    companyName:string,
    companyType:string,
    noOfEmployes:string,
    email:string,
    image:string,
    phoneNo:number,
    password:string,
    isVerified?:boolean,
    isBlocked?:boolean
}
interface OTP{
    name:string,
    otp:number,
    expiration: Date
}
interface adminType{
    name:string,
    password:string
}
interface JwtToken {
    header: string;
    payload: string;
    signature: string;
  }

interface MySessionData {
    developersessionData?: { name: string; email: string},
    companySessionData?:{companyName: string;email: string;}

}
interface tokenData{
    name?:string,
    email?:string,
    companyName?:string
}
export {
    MySessionData,
    OTP,
    JwtToken,
    adminType,
    developerData,
    companyData,
    adminSideListingData,
    tokenData
} 
