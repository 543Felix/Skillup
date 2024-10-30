import dotenv from 'dotenv'
dotenv.config()

 let senderMail = process.env.Sender_Email as string
 let senderMailPassword = process.env.Sender_Mail_Password as string
 let connectionString = process.env.Mongoosse_Conection_String as string
let accessTokenSecretKey = process.env.accessToken_Secret_Key as string
let refreshTokenSecretKey = process.env.refreshToken_Secret_Key as string

export {
    senderMail,
    senderMailPassword,
    connectionString,
    accessTokenSecretKey,
    refreshTokenSecretKey
} 