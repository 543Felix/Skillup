import React,{Dispatch, SetStateAction} from "react"
import {Pagination,Stack} from '@mui/material'

 const main = {
            '& .Mui-selected': {
      color: '#feffff !important',
      backgroundColor: '#7f00ff !important', 
    },
    '& .MuiPaginationItem-root': {
      color: 'white',
      borderColor: 'white', 
      backgroundColor: '#333', 
    },
    '& .MuiPaginationItem-outlined': {
      borderColor: 'white', 
    },
    '& .MuiPaginationItem-outlined.Mui-selected': {
      borderColor: '#7f00ff !important', 
    }
        }

        interface Props{
          totalPages:number,
          setCurrentPage:Dispatch<SetStateAction<number>>
        }

const PaginationComponent:React.FC<Props> = ({totalPages,setCurrentPage})=>{
  
 


  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };
  
    return (
     <>
     <div className="w-full flex justify-center items-center">
<Stack>
      <Pagination count={totalPages} className="border-white text-white" variant="outlined" shape="rounded" onChange={handlePageChange} sx={main} />
      {/* {page&&(
       <span className="text-white">{`Current page number = ${page}`}</span>
)} */}
     </Stack>
     </div>
     
     </>
    )
}

export default PaginationComponent