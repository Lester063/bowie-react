import { useEffect, useState } from "react";
import axios from "axios";

const useFetch = (url, isClicked) => {

    const [data, setData] = useState([]);

    useEffect(()=>{
        axios.get(url,
            {withCredentials:true})
            .then(res=>{
                setData(res.data.message)
            })
            .catch((error) => {
                if(error.response) {
                    if(error.response.status === 403) {
                        setData(403);
                    }
                }
            });
    }, [url, isClicked])
    return data;
}
 
export default useFetch;