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
    }, [url, isClicked])
    return data;
}
 
export default useFetch;