import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface data{
    name :string,
}

const initialState :data={
    name:'',
}

const adminRegisterDataSlice = createSlice({
    name:'adminRegisterData',
    initialState,
    reducers:{
        setAdminData: (state, action: PayloadAction<data>) => {
            state.name = action.payload.name;
          },
          clearAdminData: (state) => {
            state.name = '';
          },
    }
})

export const{setAdminData,clearAdminData} = adminRegisterDataSlice.actions
export default adminRegisterDataSlice.reducer