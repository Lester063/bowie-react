import { useEffect, useState } from "react";
import axios from "axios";

const useFetch = (url) => {

    const [data, setData] = useState([]);

    useEffect(()=>{
        async function fetchData(){
            try {
                const response = await axios.get(url, {withCredentials:true});
                setData(response.data.message);
            }
            catch(error) {
                setData(error.response.status);
            }
    
        }
        
        fetchData();
    }, [url]);
    return data;
}
 
export default useFetch;