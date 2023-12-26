import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import useFetch from '../../components/useFetch';
import ReturnsList from './ReturnsList';
import axios from 'axios';

const MyReturn = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isClicked, setClicked] = useState(false);

    const data = useFetch(`http://localhost:8000/api/userreturns`, isClicked);

    useEffect(() => {
        document.title = 'My Returns';
        if (data.constructor === Array) {
            setReturns(data);
            setLoading(false);
            setClicked(false);
            console.log(data);
        }
    }, [data]);

    const approveReturn = async (e, returnid) => {
        e.preventDefault();
        let data = 'data,not sure why I need to pass a data, definitely a bug.'
        try {
            let response = await axios.put(`http://localhost:8000/api/return/${returnid}/approve`,data, { withCredentials: true });
            setClicked(true);
            console.log(response.data);
        }
        catch(error) {
            alert(error.response.data.message);
        }
    }

    let menu;
    menu = (
        <>
            <div className="container mt-3">
                {loading && <Loading />}
                {
                    !loading &&
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4>My Returns</h4>
                                </div>
                                <div className="card-body">
                                    <ReturnsList returns={returns} approveReturn={approveReturn}/>
                                    {returns.length < 1 && <p>No returns to fetch.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )

    return (
        <>
            {menu}
        </>
    );
}

export default MyReturn;