import { useEffect, useState } from "react";
import axios from "axios";

const useFetch = (url, isClicked) => {

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
    }, [isClicked]);
    return data;
}
 
export default useFetch;