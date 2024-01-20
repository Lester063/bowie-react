import { useState, useEffect, useContext } from "react";
import HoverMessage from "../../components/HoverMessage";
import { useLocation } from "react-router-dom";
import { ViewReturnContext } from "./ViewReturn";
import { MyReturnContext } from "./MyReturn";
import { UsersReturnContext } from "./UsersReturn";
import axios from 'axios';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001');
const ReturnsList = () => {
    const is_admin = localStorage.getItem('is_admin');
    const [message, setMessage] = useState('');
    const url = useLocation();

    const viewreturndata = useContext(ViewReturnContext);
    const myreturndata = useContext(MyReturnContext);
    const usersreturndata = useContext(UsersReturnContext);
    const [returns, setReturns] = useState([]);

    useEffect(()=>{
        setReturns(viewreturndata);
    },[viewreturndata]);

    useEffect(()=>{
        setReturns(myreturndata);
    },[myreturndata]);

    useEffect(()=>{
        setReturns(usersreturndata);
    },[usersreturndata]);

    const hoverDisabledButton = async (id, isDisabled) => {
        if (isDisabled) {
            setMessage('Request for return is already approved.')
            document.getElementById(id).style.display = 'block';
        }
    }

    const hoverOut = async (id) => {
        document.getElementById(id).style.display = 'none';
    }

    const approveReturn = async (e, returnid) => {
        e.preventDefault();
        let data = 'data,not sure why I need to pass a data, definitely a bug.'
        try {
            let response = await axios.put(`http://localhost:8000/api/return/${returnid}/approve`, data, { withCredentials: true });
            let updatedReturn;
            if (response.status === 200) {
                const newReturns = returns.map((returnn) => {
                    if (String(returnn.id) === String(returnid)) {
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
        catch (error) {
            alert(error.response.data.message);
        }
    }

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
    },[socket, returns]);

    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th style={{ width: "10px" }}>List#</th>
                    {!url.pathname.includes('myreturns') &&
                        <th>Returner's Name</th>
                    }
                    <th>Item Name</th>
                    <th>Item Code</th>
                    <th>Return Status</th>
                    {is_admin === '1' &&
                        <th>Action</th>
                    }
                </tr>
            </thead>
            <tbody>
                {returns && returns.map((returnn, index) => {
                    return (
                        <tr key={index}>
                            <td>{index + 1}.</td>
                            {!url.pathname.includes('myreturns') &&
                                <td>{returnn.name}</td>
                            }
                            <td><a href={`/requestcommunication/${returnn.idrequest}`}>{returnn.itemname}</a></td>
                            <td>{returnn.itemcode}</td>
                            <td><span style={{
                                backgroundColor: '#47bf67',
                                padding: "5px",
                                borderRadius: "5px",
                                color: "#fff",
                            }}>{returnn.is_approve === 1 ? 'Approved' : 'Pending'}</span></td>
                            {is_admin === '1' &&
                                <td>
                                    <HoverMessage id={index + 'approvereturn'} message={message} />
                                    <span onMouseOut={() => { hoverOut(index + 'approvereturn') }}
                                        onMouseOver={() => {
                                            hoverDisabledButton(index + 'approvereturn', returnn.is_approve === 1 ? true : false)
                                        }}>
                                        <button className="btn btn-primary" disabled={returnn.is_approve === 1 ? true : false}
                                            onClick={(e) => {
                                                if (window.confirm('are you sure?')) {
                                                    approveReturn(e, returnn.id)
                                                }
                                            }
                                            }
                                        ><i className="bi bi-check-circle"></i></button>
                                    </span>
                                </td>
                            }
                        </tr>
                    )
                })
                }
            </tbody>

        </table>
    );
}

export default ReturnsList;