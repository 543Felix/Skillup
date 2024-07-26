import  { useState} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

interface Slot{
  date:string,
  time:string
}

const AddSlot =  ()=>{

  
  const today = new Date();
  const newDate =  new Date(today.getFullYear(), today.getMonth(), today.getDate()).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
  const [selectedDate, setSelectedDate] = useState<string>(newDate);

  const [slots, setSlots] = useState<Slot[]>([]);
  const [time, setTime] = useState('');

 
  const stripTime = (date: Date): string => {
    const newDate =  new Date(date.getFullYear(), date.getMonth(), date.getDate());
   const updatedDate =  newDate.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
   return updatedDate
  }
  const handleDateChange = (date: Date) => {
    // Set selected date with time stripped
    setSelectedDate(stripTime(date));
  };
  // Filter events for the selected date
 const fileredSlots = slots.filter((slot)=>{
  return slot.date === selectedDate
 })



  function getIndexOfSlot(time:string,date:string = selectedDate){
    for(let i:number =0 ;i<slots.length;i++){
      if(slots[i].date === date&&slots[i].time === time){

       return i
      }
  }
  return -1
  }

  
  

  const addSlot = async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    const regex = /^(?:(?:0?[1-9]|1[0-2]):[0-5][0-9] ?[aApP][mM](?: ?- ?(?:0?[1-9]|1[0-2]):[0-5][0-9] ?[aApP][mM])?)$/
    if(!regex.test(time.trim())){
      toast.error("Invalid time slot format. Please use 'hh:mm am/pm' or 'hh:mm am/pm - hh:mm am/pm'.")
      return
    }
    
    if(selectedDate&&time.trim().length!==0){
      const newSlot = {
        date:selectedDate,
        time:time
      }
      const newSlots = slots
      newSlots.push(newSlot)
      setSlots(()=>{
        return[...newSlots]
      })
      setTime('');
    }
     

  
    
  };
  const removeSlot = (time:string)=>{
    const i =  getIndexOfSlot(time)
   const newSlots = slots
   newSlots.splice(i,1)
    setSlots(()=>{
      return[...newSlots]
    })
  }
   
   return(
    <>
    <div className='h-[330px] mt-8 mb-5'>
    <div className='flex px-7' >
      <div>
        <DatePicker
          selected={new Date(selectedDate)}
          onChange={(date: Date) => handleDateChange(date)}
          inline
          minDate={today}  // This will disable all previous dates
          />
      </div>
      {/* {{ marginLeft: '20px', maxHeight: '400px', overflowY: 'scroll' }} */}
      <div className=' h-[235px] w-[235px] ml-4 rounded-[5px] max-h-[400px] overflow-y-scroll bg-transparent border border-wite text-white p-2'>
        <h3 className='text-sm font-semibold fixed ' >Added slots for {selectedDate || 'selected date'}:</h3>
        <div className='overflow-y-scroll mt-6'>
        <ul className='' >
          {fileredSlots.map((slot, index) => (
            <li key={index} className='text-white bg-violet mb-1 p-2 flex justify-between items-center'>
              {slot.time}
              <FontAwesomeIcon className='text-white' icon={faXmark}  onClick={()=>removeSlot(slot.time)} />
              </li>
          ))}
        </ul>
        </div>
       
      </div>
    </div>
    <div className='flex  mt-[10px] px-7  justify-center '>
    <input
    className='focus:border-none w-[300px]'
      type="text"
      value={time}
      onChange={(e) => setTime(e.target.value)}
      placeholder="Add slots"
      
    />
    <button onClick={(e)=>addSlot(e)} className='bg-violet text-white px-5 py-1 rounded-[8px] ml-2 '>Add Slot</button>
    {/* <button className='bg-violet text-white px-5 py-1 rounded-[8px] ml-2 ' onClick={()=>TestToast()}>test Toast</button> */}
  </div>
    </div>
   
    </>

   )
}

export default AddSlot