import React,{useState} from "react"


const Pagination:React.FC = ()=>{
    const arr:string[] = ['typescript','python','javaScript','java','Ai','machine Learning','Node js','Exress js','Data structures','typescript','python','javaScript','java','Ai','machine Learning','Node js','Exress js','Data structures','typescript','python','javaScript','java','Ai','machine Learning','Node js','Exress js','Data structures','typescript','python','javaScript','java','Ai','machine Learning','Node js','Exress js','Data structures']
      let  numOfPages = arr.length/4
     if(numOfPages!==Math.floor(numOfPages)){
       numOfPages = Math.floor(numOfPages)+1
      }
    function divide(content:string[] ,limit:number,page:number){

      console.log('contentsInsideaPage = ',arr.slice((page-1)*limit,limit*page))
      console.log
    }
    console.log('')
   divide(arr,4,3)
    const [startIndex,setStartIndex] = useState<number>(0)
    const [endIndex,setEndIndex] = useState<number>(6)
   const [currentPage,setCurrentPage] = useState<number>(1)
   const paginationNumber:number[] = []
   for(let i:number =1;i<=numOfPages;i++){
    paginationNumber.push(i)
   }

   const incrementPageNo = ()=>{
     if(currentPage<paginationNumber.length){
      setCurrentPage(currentPage+1)
      if(currentPage>=paginationNumber[paginationNumber.length-2]){
        setEndIndex(endIndex+1)
      }
       else if(currentPage>=6){
        setStartIndex(startIndex+1)
        setEndIndex(endIndex+1)
      }
     }
   }

   const decrementPageNo=()=>{
    if(currentPage>1){
     if(currentPage===paginationNumber[paginationNumber.length-1]){
      setEndIndex(endIndex-1)
      setStartIndex(startIndex-1)
     }else if(currentPage<=6){
      setStartIndex(startIndex-1)
     }
      setCurrentPage(currentPage-1)
    }
   }
  
    return (
        <>
        <div className="flex justify-center space-x-1 text-white mt-12">
	<button title="previous" type="button" className="inline-flex items-center justify-center w-8 h-8 py-0 border rounded-md shadow-md bg-black border-gray-100" onClick={decrementPageNo}>
		<svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4">
			<polyline points="15 18 9 12 15 6"></polyline>
		</svg>
	</button>
    {paginationNumber&&paginationNumber.length<=7?paginationNumber.map((item)=>(
	<button type="button" title="Page 1" className={`inline-flex items-center justify-center w-8 h-8 text-sm font-semibold border rounded shadow-md  ${currentPage===item?' text-whie bg-violet border-none ':'bg-black '}`}>{item}</button>
    )):
    <>
    {paginationNumber.slice(startIndex,endIndex).map((item)=>(
	<button type="button" title="Page 1" className={`inline-flex items-center justify-center w-8 h-8 text-sm font-semibold border rounded shadow-md  ${currentPage===item?' text-whie bg-violet border-none ':'bg-black '}`}>{item}</button>
    ))}
    {currentPage!==paginationNumber[paginationNumber.length-1]&&(<p>...</p>)}
    
    </>
    }
	<button title="next" type="button" className="inline-flex items-center justify-center w-8 h-8 py-0 border rounded-md shadow-md bg-black border-gray-100" onClick={incrementPageNo}>
		<svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4">
			<polyline points="9 18 15 12 9 6"></polyline>
		</svg>
	</button>
     </div>
        </>
     
    )
}

export default Pagination