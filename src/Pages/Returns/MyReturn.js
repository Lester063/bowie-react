import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import useFetch from '../../components/useFetch';
import ReturnsList from './ReturnsList';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001');

const MyReturn = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    const data = useFetch(`http://localhost:8000/api/userreturns`);

    useEffect(() => {
        document.title = 'My Returns';
        if (data.constructor === Array) {
            setReturns(data);
            setLoading(false);
        }
    }, [data]);

    useEffect(()=>{
        socket.on("sendNotificationToClient", ([message, updatedReturn, action]) => {
            if(action === 'return') {
                const newreturn = returns.map((returnn)=>{
                    if(String(returnn.id) === String(updatedReturn.id)) {
                        const updated = {
                            ...returnn,
                            is_approve: updatedReturn.is_approve,
                        };
                        return updated;
                    }
                    return returnn;
                });
                setReturns(newreturn);
            }
        });

        return () => socket.off('sendNotificationToClient');
    },[socket, returns])

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
    menu = (
        <>
            <div className="container mt-3">
                {loading && <Loading />}
                {
                    !loading &&
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card mt-3">
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
        <div className="mobile-body">
            {menu}
        </div>
    );
}

export default MyReturn;