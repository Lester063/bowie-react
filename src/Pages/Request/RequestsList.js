import { useContext, useEffect, useState } from "react";
import HoverMessage from "../../components/HoverMessage";
import { useLocation } from "react-router-dom";
import { RequestContext } from './MyRequest';
import { UsersRequestContext } from './UsersRequest';
import { ViewRequestContext } from './ViewRequest';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001');

const RequestsList = () => {
    const isAdmin = localStorage.getItem('isAdmin');
    const userid = localStorage.getItem('userid');
    const [message, setMessage] = useState('');
    const url = useLocation();

    const userrequestsdata = useContext(UsersRequestContext);
    const myrequestdata = useContext(RequestContext);
    const viewrequestdata = useContext(ViewRequestContext);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        setRequests(userrequestsdata);
    }, [userrequestsdata]);

    useEffect(() => {
        setRequests(myrequestdata);
    }, [myrequestdata]);

    useEffect(() => {
        setRequests(viewrequestdata);
    }, [viewrequestdata]);

    useEffect(() => {
        socket.on("sendNotificationToClient", ([message, updatedRequest, action]) => {
            if (action === 'request') {
                const newrequest = requests.map((request) => {
                    if (String(request.id) === String(updatedRequest.id)) {
                        const updated = {
                            ...request,
                            isAvailable: updatedRequest.isAvailable,
                            statusRequest: updatedRequest.statusRequest,
                        };
                        return updated;
                    }
                    return request;
                });
                setRequests(newrequest);
            }
        });

        return () => socket.off('sendNotificationToClient');
    }, [socket, requests]);

    const hoverDisabledButton = async (id, message, isDisabled) => {
        if (isDisabled) {
            switch (message) {
                case 'Approved':
                    setMessage('Request is already approved.')
                    document.getElementById(id).style.display = 'block';
                    break;
                case 'Closed':
                    setMessage('Request is already closed.')
                    document.getElementById(id).style.display = 'block';
                    break;
                case 'Declined':
                    setMessage('Request is already declined.')
                    document.getElementById(id).style.display = 'block';
                    break;
                case 'Completed':
                    setMessage('Request is already completed.')
                    document.getElementById(id).style.display = 'block';
                    break;
                case 'Return':
                    setMessage('Request is not approve or return request is already sent.')
                    document.getElementById(id).style.display = 'block';
                    break;
                default: break;
            }
        }
    }

    const hoverOut = async (id) => {
        document.getElementById(id).style.display = 'none';
    }

    const actionRequest = async (e, id, action) => {
        e.preventDefault();
        try {
            let newRequests;
            let updatedRequest;
            let response = await axios.put(`http://localhost:8000/api/actionrequest/${id}/edit`, { action: action }, { withCredentials: true });
            if (response.status === 200) {
                newRequests = requests.map((request) => {
                    if (request.id === id) {
                        updatedRequest = {
                            ...request,
                            statusRequest: action === 'Approving' ? 'Approved' : 'Declined',
                            isAvailable: action === 'Approving' ? 0 : 1
                        };
                        socket.emit("sendNotificationToServer", [response.data.notification, updatedRequest, 'request']);
                        return updatedRequest;
                    }

                    if (response.data.data.idItem === request.idItem && request.statusRequest === 'Pending') {
                        updatedRequest = {
                            ...request,
                            statusRequest: action === 'Approving' ? 'Closed' : request.statusRequest,
                            isAvailable: action === 'Approving' ? 0 : 1
                        };
                        socket.emit("sendNotificationToServer", [response.data.notification, updatedRequest, 'request']);
                        return updatedRequest;
                    }
                    return request;
                });
                setRequests(newRequests);
            }
        }
        catch (error) {
            alert(error.response.data.message);
        }
    }


    const returnItem = async (e, idRequest) => {
        e.preventDefault();
        try {
            let response = await axios.post(`http://localhost:8000/api/return`, { idRequest: idRequest }, { withCredentials: true });
            if (response.status === 200) {
                const newRequests = requests.map((request) => {
                    if (request.id === idRequest) {
                        const updatedRequest = {
                            ...request,
                            isReturnSent: 1
                        }
                        return updatedRequest;
                    }
                    return request;
                });
                setRequests(newRequests);
                socket.emit("sendNotificationToServer", [response.data.notification]);
            }
            else {
                console.log(response.status);
            }
        }
        catch (error) {
            alert(error.response.data.message);
        }
    }

    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th style={{ width: "10px" }}>List#</th>
                    {!url.pathname.includes('myrequests') &&
                        <th>Requester's Name</th>
                    }
                    <th>Item Name</th>
                    <th>Item Code</th>
                    <th>Item Status</th>
                    <th>Request Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {requests && requests.map((request, index) => {
                    return (
                        <tr key={index}>
                            <td>{index + 1}.</td>
                            {!url.pathname.includes('myrequests') &&
                                <td>{request.firstName}</td>
                            }
                            <td><a href={`/requestcommunication/${request.id}`}>{request.itemName}</a></td>
                            <td>{request.itemCode}</td>
                            <td>{request.isAvailable === 1 ? 'Available' : 'Not available'}</td>
                            <td><span style=
                                {{
                                    backgroundColor: request.statusRequest === 'Approved' || request.statusRequest === 'Pending'
                                        || request.statusRequest === 'Completed' ? '#47bf67' : '#f75036',
                                    padding: "5px",
                                    borderRadius: "5px",
                                    color: "#fff",
                                }}>{request.statusRequest}</span></td>
                            <td>
                                {isAdmin === '1' &&
                                    <>
                                        <HoverMessage id={index + 'approve'} message={message} />
                                        <span onMouseOut={() => { hoverOut(index + 'approve') }} onMouseOver={() => {
                                            hoverDisabledButton(index + 'approve', request.statusRequest,
                                                request.statusRequest === 'Approved' || request.statusRequest === 'Closed' || request.statusRequest === 'Completed' ? true : false)
                                        }}>
                                            <button id='approvebutton' className="btn btn-primary" onClick={(e) => {
                                                if (window.confirm('are you sure?')) {
                                                    actionRequest(e, request.id, 'Approving');
                                                }
                                            }} disabled={request.statusRequest === 'Approved' || request.statusRequest === 'Closed'
                                                || request.statusRequest === 'Completed' ? true : false}><i className="bi bi-check-circle"></i></button>
                                        </span>

                                        <HoverMessage id={index + 'decline'} message={message} />
                                        <span style={{ marginLeft: "5px" }} onMouseOut={() => { hoverOut(index + 'decline') }} onMouseOver={() => {
                                            hoverDisabledButton(index + 'decline', request.statusRequest,
                                                request.statusRequest === 'Declined' || request.statusRequest === 'Closed' || request.statusRequest === 'Completed' ? true : false)
                                        }}>
                                            <button className="btn btn-danger" onClick={(e) => {
                                                if (window.confirm('are you sure?')) {
                                                    actionRequest(e, request.id, 'Declining');
                                                }
                                            }} disabled={request.statusRequest === 'Declined' || request.statusRequest === 'Closed'
                                                || request.statusRequest === 'Completed' ? true : false}><i className="bi bi-bag-x"></i></button>
                                        </span>

                                    </>
                                }
                                {String(request.idRequester) === String(userid) &&
                                    <>
                                        <HoverMessage id={index + 'return'} message={message} />
                                        <span style={{ marginLeft: "5px" }} onMouseOut={() => { hoverOut(index + 'return') }} onMouseOver={() => {
                                            hoverDisabledButton(index + 'return', 'Return', request.statusRequest !== 'Approved' || request.isReturnSent === 1 ? true : false)
                                        }}>
                                            <button id='returnbutton' className="btn btn-primary" disabled={request.statusRequest !== 'Approved' || request.isReturnSent === 1 ? true : false}
                                                onClick={(e) => {
                                                    if (window.confirm('are you sure?')) {
                                                        returnItem(e, request.id);
                                                    }
                                                }}><i className="bi bi-arrow-left-right"></i></button>
                                        </span>

                                    </>
                                }
                            </td>
                        </tr>
                    )
                })
                }
            </tbody>

        </table>
    );
}

export default RequestsList;