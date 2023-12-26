import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import useFetch from '../../components/useFetch';
import ReturnsList from './ReturnsList';
import ForbiddenPage from '../../components/ForbiddenPage';
import axios from 'axios';

const UsersReturn = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    const is_admin = localStorage.getItem('is_admin');

    const data = useFetch(`http://localhost:8000/api/returns`);

    useEffect(() => {
        document.title = "User's Return";
        if (data.constructor === Array) {
            setReturns(data);
            setLoading(false);
            console.log(data);
        }
    }, [data]);
    
    const approveReturn = async (e, returnid) => {
        e.preventDefault();
        let data = 'data,not sure why I need to pass a data, definitely a bug.'
        try {
            let response = await axios.put(`http://localhost:8000/api/return/${returnid}/approve`,data, { withCredentials: true });
            console.log(returnid);
            if(response.status === 200) {
                const newReturns = returns.map((returnn)=> {
                    if(returnn.id === returnid) {
                        const updatedReturns = {
                            ...returnn,
                            is_approve: 1
                        }
                        return updatedReturns;
                    }
                    return returnn;
                });
                setReturns(newReturns);
            }
            else {
                console.log(response.status);
            }
        }
        catch(error) {
            alert(error.response.data.message);
        }
    }

    let menu;
    if (is_admin === '1') {
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
                                    <h4>User's Returns</h4>
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
    } else {
        menu = (
            <ForbiddenPage />
        )
    }

    return (
        <>
            {menu}
        </>
    );
}

export default UsersReturn;