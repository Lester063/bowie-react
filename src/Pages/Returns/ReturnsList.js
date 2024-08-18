import { useState, useEffect, useContext, createContext } from "react";
import HoverMessage from "../../components/HoverMessage";
import ModalTemplate from "../../components/ModalTemplate";
import { useLocation } from "react-router-dom";
import { ViewReturnContext } from "./ViewReturn";
import { MyReturnContext } from "./MyReturn";
import { UsersReturnContext } from "./UsersReturn";
import axios from 'axios';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001');
export const MyIdRequestContext = createContext(null);
const ReturnsList = () => {
    const isAdmin = localStorage.getItem('isAdmin');
    const [message, setMessage] = useState('');
    const url = useLocation();

    const viewreturndata = useContext(ViewReturnContext);
    const myreturndata = useContext(MyReturnContext);
    const usersreturndata = useContext(UsersReturnContext);
    const [returns, setReturns] = useState([]);
    const [getidreq, setIdRequest] = useState(null);

    const getRequestId = async (idreq) => {
        setIdRequest(idreq);
    }

    useEffect(() => {
        setReturns(viewreturndata);
    }, [viewreturndata]);

    useEffect(() => {
        setReturns(myreturndata);
    }, [myreturndata]);

    useEffect(() => {
        setReturns(usersreturndata);
    }, [usersreturndata]);

    const hoverDisabledButton = async (id, message, isDisabled) => {
        if (isDisabled) {
            switch (message) {
                case 'Return':
                    setMessage('Request for return is already approved.');
                    document.getElementById(id).style.display = 'block';
                    break;
                case 'Review':
                    setMessage('Pending for return / Item reviewed.');
                    document.getElementById(id).style.display = 'block';
                    break;
                default:
                    console.log('no message being displayed when hovering disabled button.');
            }
        }
        else {
            switch (message) {
                case 'Return':
                    setMessage('Return');
                    document.getElementById(id).style.display = 'block';
                    break;
                case 'Review':
                    setMessage('Review/Comment');
                    document.getElementById(id).style.display = 'block';
                    break;
                default:
                    console.log('no message being displayed when hovering disabled button.');
            }
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
                            isApprove: 1
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

    useEffect(() => {
        socket.on("sendNotificationToClient", ([message, updatedReturn, action]) => {
            if (action === 'return') {
                const newreturn = returns.map((returnn) => {
                    if (String(returnn.id) === String(updatedReturn.id)) {
                        const updated = {
                            ...returnn,
                            isApprove: updatedReturn.isApprove,
                        };
                        return updated;
                    }
                    return returnn;
                });
                setReturns(newreturn);
            }
        });

        return () => socket.off('sendNotificationToClient');
    }, [socket, returns]);

    let menu;
    menu = (
        <>
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
                        {isAdmin === '1' &&
                            <th>Action</th>
                        }
                        {url.pathname.includes('myreturns') &&
                            <th>Review</th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {returns && returns.map((returnn, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}.</td>
                                {!url.pathname.includes('myreturns') &&
                                    <td>{returnn.firstName}</td>
                                }
                                <td><a href={`/requestcommunication/${returnn.idRequest}`}>{returnn.itemName}</a></td>
                                <td>{returnn.itemCode}</td>
                                <td><span style={{
                                    backgroundColor: '#47bf67',
                                    padding: "5px",
                                    borderRadius: "5px",
                                    color: "#fff",
                                }}>{returnn.isApprove === 1 ? 'Approved' : 'Pending'}</span></td>
                                {isAdmin === '1' &&
                                    <td>
                                        <HoverMessage id={index + 'approvereturn'} message={message} />
                                        <span onMouseOut={() => { hoverOut(index + 'approvereturn') }}
                                            onMouseOver={() => {
                                                hoverDisabledButton(index + 'approvereturn', 'Return', returnn.isApprove === 1 ? true : false)
                                            }}>
                                            <button className="btn btn-primary" disabled={returnn.isApprove === 1 ? true : false}
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
                                {url.pathname.includes('myreturns') &&
                                    <td>
                                        <HoverMessage id={index + 'review'} message={message} />
                                        <span onMouseOut={() => { hoverOut(index + 'review') }}
                                            onMouseOver={() => {
                                                hoverDisabledButton(index + 'review', 'Review',
                                                    returnn.isApprove === 1 && returnn.isReviewed !== 1 ? false : true)
                                            }}>
                                            <button type="button" className="btn btn-primary" data-toggle="modal"
                                                data-target="#exampleModalCenter" disabled={returnn.isApprove === 1 && returnn.isReviewed !== 1 ? false : true}
                                                onClick={() => getRequestId(returnn.idRequest)}
                                            >
                                                <i className="bi bi-chat-right-heart"></i>
                                            </button>
                                        </span>
                                    </td>
                                }
                            </tr>
                        )
                    })
                    }
                </tbody>

            </table>
        </>
    )

    return (
        <MyIdRequestContext.Provider value={getidreq}>
            {menu}
            <ModalTemplate title="Review" form="review" />
        </MyIdRequestContext.Provider>
    );
}

export default ReturnsList;