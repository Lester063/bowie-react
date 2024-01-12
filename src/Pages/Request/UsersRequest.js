import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import useFetch from '../../components/useFetch';
import RequestsList from './RequestsList';
import ForbiddenPage from '../../components/ForbiddenPage';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001');

const UsersRequest = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const is_admin = localStorage.getItem('is_admin');

    const data = useFetch(`http://localhost:8000/api/requests`);

    useEffect(() => {
        document.title = "User's Requests";
        if (data.constructor === Array) {
            setRequests(data);
            setLoading(false);
        }
    }, [data]);

    const actionRequest = async (e, id, action) => {
        e.preventDefault();
        try {
            let newRequests;
            let updatedRequest;
            let response = await axios.put(`http://localhost:8000/api/actionrequest/${id}/edit`, { action: action }, { withCredentials: true });
            if(response.status === 200) {
                newRequests = requests.map((request) => {
                    if (request.id === id) {
                      updatedRequest = {
                        ...request,
                        statusrequest: action === 'Approving' ? 'Approved' : 'Declined',
                        is_available: action === 'Approving' ? 0 : 1
                      };
                      socket.emit("sendNotificationToServer", [response.data.notification, updatedRequest, 'request']);              
                      return updatedRequest;
                    }

                    if(response.data.data.iditem === request.iditem && request.statusrequest === 'Pending') {
                        updatedRequest = {
                            ...request,
                            statusrequest: action === 'Approving' ? 'Closed' : request.statusrequest,
                            is_available: action === 'Approving' ? 0 : 1
                          };
                          socket.emit("sendNotificationToServer", [response.data.notification, updatedRequest, 'request']);
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
                    if(request.id === idrequest) {
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
    if (is_admin === '1') {
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
                                    <h4>User's Requests</h4>
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
    } else {
        menu = (
            <ForbiddenPage />
        )
    }

    return (
        <div className="mobile-body">
            {menu}
        </div>
    );
}

export default UsersRequest;