import { createSlice,PayloadAction } from "@reduxjs/toolkit";

export interface data{
    _id:string,
    image:string,
    name:string
}
const data = localStorage.getItem('developerData')
const parsedData =  await JSON.parse(data as string)

const initialState :data={
    _id: parsedData?._id ?parsedData?._id:'',
    image : parsedData?.image?parsedData?.image:'',
    name : parsedData?.name?parsedData?.name:''
}

const developerRegisterDataSlice = createSlice({
    name:'developerRegisterData',
    initialState,
    reducers:{
        setDeveloperData: (state, action: PayloadAction<data>) => {
          return{
            ...state,
            _id: action.payload._id,
            image : action.payload.image,
            name :  action.payload.name
          }
          },
          devLogOut: (state) => {
            localStorage.removeItem('developerData')
            return{
              ...state,
              _id:'',
              image:'',
              name:''
            }
          },
          updateImage:(state, action : PayloadAction<{image:string}> )=>{
            return{
              ...state, 
              image :action.payload.image
            }
          }
    }
})

export const{setDeveloperData,devLogOut,updateImage} = developerRegisterDataSlice.actions
export default developerRegisterDataSlice.reducer