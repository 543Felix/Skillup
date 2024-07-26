import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface data{
    _id :string,
    image : string
    name:string
}

const data = localStorage.getItem('companyData')
const parsedData = JSON.parse(data as string)

const initialState :data={
    _id:parsedData?._id??'',
    image:parsedData?.image??'',
    name:parsedData?.name??''
}
const companyRegisterDataSlice = createSlice({
    name:'companyRegisterData',
    initialState,
    reducers:{
        setCompanyData: (state, action: PayloadAction<data>) => {
            state._id = action.payload._id;
            state.image = action.payload.image;
            state.name = action.payload.name
          },
          clearCompanyData: (state) => {
            localStorage.removeItem('companyData')
            state._id = '';
            state.image = '';
            state.name = ''
          },
          updateCompanyImage:(state, action : PayloadAction<{image:string}> )=>{
            return{
              ...state, 
              image :action.payload.image
            }
          }
    }
})

export const{setCompanyData,clearCompanyData,updateCompanyImage} = companyRegisterDataSlice.actions
export default companyRegisterDataSlice.reducer