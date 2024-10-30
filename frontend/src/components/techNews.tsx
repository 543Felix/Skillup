import axios from 'axios'

import { useEffect } from "react"

const TechNews = ()=>{
    useEffect(()=>{
        const options = {
            method: 'GET',
            url: 'https://patienceman-docs1.p.rapidapi.com/public/doc-tags',
            headers: {
              'x-rapidapi-key': '3191982bddmsh329a7de0b71a35fp133587jsnf4400e22a27b',
              'x-rapidapi-host': 'patienceman-docs1.p.rapidapi.com',
              Accept: 'Application/json'
            }
          };

        try {
            axios.request(options).then((response)=>{
                console.log(response.data);
            })
        } catch (error) {
            console.error(error);
        } 
    },[])
return(
   <div>
    <h1 className="text-white">New Name</h1>
   </div>
)
}

export default TechNews