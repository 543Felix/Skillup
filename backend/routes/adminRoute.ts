import express from 'express'
import { adminController } from '../controllers/adminControllers'
const adminRoute = express()

adminRoute.post('/login',adminController.login)

adminRoute.patch('/developers/block',adminController.blockDeveloper)
adminRoute.patch('/developers/unBlock',adminController.unblockDeveloper)
adminRoute.get('/developers',adminController.showDevelopers)

adminRoute.get('/companies',adminController.showCompanies)
adminRoute.patch('/companies/block',adminController.blockCompany)
adminRoute.patch('/companies/unBlock',adminController.unblockCompany)
adminRoute.patch('/companies/verify',adminController.verifyCompany)
adminRoute.patch('/companies/unverify',adminController.unverifyCompany)

adminRoute.get('/dashBoard',adminController.getDetailsOnDashboard)
adminRoute.get('/chartData',adminController.ChartData)
// adminRoute.get('/companyChart',adminController.developerChartData)


adminRoute.post('/logout',adminController.logOut)

export default adminRoute