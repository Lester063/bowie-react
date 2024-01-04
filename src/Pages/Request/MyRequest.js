import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import useFetch from '../../components/useFetch';
import RequestsList from './RequestsList';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001');

const MyRequest = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const userid = localStorage.getItem('userid');

    const data = useFetch(`http://localhost:8000/api/userrequest`);

    useEffect(() => {
        document.title = 'My Requests';
        if (data.constructor === Array) {
            setRequests(data);
            setLoading(false);
        }
    }, [data]);

    // useEffect(()=>{
    //     socket.on("sendNotificationToClient", ([message, newRequests]) => {
    //         const newRequest = newRequests.filter((req)=>String(req.idrequester) === String(userid));
    //         setRequests(newRequest);
    //     });

    //     return () => socket.off('sendNotificationToClient');
    // },[socket])

    const actionRequest = async (e, id, action) => {
        e.preventDefault();
        try {
            let response = await axios.put(`http://localhost:8000/api/actionrequest/${id}/edit`, { action: action }, { withCredentials: true });
            if(response.status === 200) {
                const newRequests = requests.map((request) => {
                    if (request.id === id) {
                      const updatedRequest = {
                        ...request,
                        statusrequest: action === 'Approving' ? 'Approved' : 'Declined',
                        is_available: action === 'Approving' ? 0 : 1
                      };              
                      return updatedRequest;
                    }

                    if(response.data.data.iditem === request.iditem && request.statusrequest === 'Pending') {
                        const updatedRequest = {
                            ...request,
                            statusrequest: action === 'Approving' ? 'Closed' : request.statusrequest,
                            is_available: action === 'Approving' ? 0 : 1
                          };              
                          return updatedRequest;
                    }
                    return request;
                  });
                  setRequests(newRequests);
            }
        }
        catch(error) {
            alert(error.response.data.message);
        }
    }

    const returnItem = async (e, idrequest) => {
        e.preventDefault();
        try {
            let response = await axios.post(`http://localhost:8000/api/return`, { idrequest: idrequest }, { withCredentials: true });
            if(response.status === 200) {
                const newRequests = requests.map((request)=>{
                    if(request.id ===idrequest) {
                        const updatedRequest = {
                            ...request,
                            isreturnsent: 1
                        }
                        return updatedRequest;
                    }
                    return request;
                });
                setRequests(newRequests);
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
                            <div className="card">
                                <div className="card-header">
                                    <h4>My Requests</h4>
                                </div>
                                <div className="card-body">
                                    <RequestsList requests={requests} actionRequest={actionRequest} returnItem={returnItem}/>
                                    {requests.length < 1 && <p>No request to fetch.</p>}
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

export default MyRequest;