import { configureStore } from "@reduxjs/toolkit";
import companyRegisterDataSlice from './slice/companySlice'
import developerRegisterDataSlice from './slice/developerSlice'
import adminRegisterDataSlice from "./slice/adminSlice";

export const store = configureStore({
    reducer:{
        companyRegisterData:companyRegisterDataSlice,
        developerRegisterData:developerRegisterDataSlice,
        adminRegisterDataData:adminRegisterDataSlice
    }
})

export type RootState = ReturnType<typeof store.getState>