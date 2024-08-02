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

interface ComapnyData{
    _id:string,
    name?:string
    companyName?:string 
    companyType:string
    noOfEmployes:string
    email:string
    phoneNo:string
    website:string
    overview:string
    specialties:string[]
    certificates:string[]
    image:string
    isVerified:boolean
    isBlocked?:boolean
   }

interface jobDetails{
    _id:string,
    companyId?:string,
    jobTitle:string,
    length:string,
    workingHoursperWeek:string,
    skills:string[],
    responsibilities:string,
    description:string,
    salary:string,
    Quiz?:object,
    createdAt:string,
    companyDetails:ComapnyData[],
    status:'open'|'closed'|''
   } 
export {
    MySessionData,
    OTP,
    JwtToken,
    adminType,
    developerData,
    companyData,
    adminSideListingData,
    tokenData,
    jobDetails
} 
