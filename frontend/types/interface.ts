import jwtDecode from 'jwt-decode'

export interface DecodedJwt extends jwtDecode.JwtPayload {
    name?: string;
    email?: string;
    sub?: string;
}
 export interface jobDetails{
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
    companyDetails:Array<T>,
    status:'open'|'closed'
   }

   export interface DeveloperDetails{
    _id:string,
    name:string,
    email:string,
    phoneNo:string,
    image:string,
    role:string,
    description:string,
    skills:string[],
   } 