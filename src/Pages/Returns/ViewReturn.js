import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import useFetch from '../../components/useFetch';
import ReturnsList from './ReturnsList';
import ForbiddenPage from '../../components/ForbiddenPage';
import axios from 'axios';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

const socket = io.connect('http://localhost:3001');

const ViewReturn = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const {id} = useParams();

    const is_admin = localStorage.getItem('is_admin');

    const data = useFetch(`http://localhost:8000/api/return/${id}`);

    useEffect(() => {
        document.title = "View Return";
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
            let updatedReturn;
            if(response.status === 200) {
                const newReturns = returns.map((returnn)=> {
                    if(String(returnn.id) === String(returnid)) {
                        updatedReturn = {
                            ...returnn,
                            is_approve: 1
                        }
                        socket.emit("sendNotificationToServer", [response.data.notification, updatedReturn, 'return']);
                        return updatedReturn;
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
                                    <h4>View Return</h4>
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

export default ViewReturn;