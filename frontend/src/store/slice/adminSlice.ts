import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface data{
    _id :string,
}

const initialState :data={
    _id:'',
}

const adminRegisterDataSlice = createSlice({
    name:'adminRegisterData',
    initialState,
    reducers:{
        setAdminData: (state, action: PayloadAction<data>) => {
            state._id = action.payload._id;
          },
          clearAdminData: (state) => {
            state._id = '';
          },
    }
})

export const{setAdminData,clearAdminData} = adminRegisterDataSlice.actions
export default adminRegisterDataSlice.reducer