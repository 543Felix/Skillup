export const convertToLocalTime =(time:string|Date)=>{
 const localTime = new Date(time).toLocaleTimeString('en-Gb', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      return localTime
}

export const convertToDate = (date:string|Date)=>{
 const localDate = new Date(date).toLocaleDateString('en-Gb', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    });
    return localDate
}