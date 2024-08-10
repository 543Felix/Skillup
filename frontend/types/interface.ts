import jwtDecode from 'jwt-decode'

export interface DecodedJwt extends jwtDecode.JwtPayload {
    name?: string;
    email?: string;
    sub?: string;
}
export interface ComapnyData{
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
    qualification:string,
    experienceLevel:string;
    Quiz?:object,
    createdAt:string,
    companyDetails:ComapnyData[],
    status:'open'|'closed'|''
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

//  export interface DeveloperData{
//     name: string;
//     _id:string;
//     email: string;
//     phoneNo?: string;
//     password: string;
//     image?: string;
//     role?: string;
//     description?: string;
//     resume?:string;
//     skills?: string[];
//     completedWorks?: string[];
//     appliedJobsCount?:number
//     isVerified: boolean;
//     isBlocked: boolean;
//  }

 interface Subscription{
  planName: 'Free' | 'Pro' | 'Premium',
  startDate:Date,
  endDate:Date,
  isExpired:boolean
}

interface workExperience{
  companyName:string;
  role:string;
  startDate:string;
  endDate:string;
}

interface Certificate {
  url:string,
  certificateName:string
}

export interface DeveloperData  {
  _id:string;
  name: string;
  email: string;
  phoneNo?: string;
  password?: string;
  image?: string;
  role?: string;
  description?: string;
  skills?: string[];
  savedJobs?: string[];
  qualification?:string
  certificates?:Certificate[]|undefined
  subscriptions?:Subscription[]|undefined,
  appliedJobsCount?:number;
  resume?:string;
  isVerified?: boolean;
  isBlocked?: boolean;
  workExperience?:Array<workExperience>,
  createdAt?:Date,
  updatedAt?:Date
}

export   interface AppliedDevs {
  developerId:string;
  coverLetter:string,
  resume:string,
  status:string,
  name:string;
  email:string;
  createdAt:Date;
  image:string;
}



interface regAndloginRes{
  _id:string;
  name:string;
  image:string;
}

export interface RegAndLoginResponse {
  message:string,
  data:regAndloginRes
}


export interface EducationData{
  education:string;
  institutionName:string;
  course:string;
  startYear:string;
  endYear:string
} 
export interface WorkData{
  _id?:string;
  companyName:string;
  role:string;
  startDate:string;
  endDate:string;
} 

