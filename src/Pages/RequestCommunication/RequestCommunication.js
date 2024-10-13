import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Loading from '../../components/Loading';
import Login from "../Auth/Login";
import axios from "axios";
import io from 'socket.io-client';
import moment from 'moment';

const socket = io.connect('http://localhost:3001');
const RequestCommunication = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [comms, setComms] = useState([]);
    const userid = localStorage.getItem('userid');
    const [requestStatus, setRequestStatus] = useState('');
    const [requestData, setRequestData] = useState({
        idRequest: "",
        message: "",
    });
    const messageRef = useRef(null);

    //input changes
    const handleChange = (e) => {
        e.preventDefault();
        setRequestData({ ...requestData, [e.target.name]: e.target.value });
    }

    const sendCommunication = async (e) => {
        e.preventDefault();
        console.log('id: '+id);
        console.log('idd: '+requestData.idRequest);
        const datos = {
            idRequest: id,
            message: requestData.message,
        }

        try {
            const response = await axios.post(`http://localhost:8000/api/requestcommunication/`, datos, { withCredentials: true });
            setComms((state) =>
                [
                    ...state,
                    {
                        id: response.data.data.id,
                        idRequest: response.data.data.idRequest,
                        idSender: response.data.data.idSender,
                        message: response.data.data.message,
                        created_at: response.data.data.created_at,
                        updated_at: response.data.data.updated_at,
                        firstName: response.data.sendername,
                    },
                ]);
            setRequestData({
                idRequest: "",
                message: ""
            });
            messageRef.current.focus();
            socket.emit("sendChatToServer", [response.data.data, response.data.sendername]);
            socket.emit("sendNotificationToServer", [response.data.notification]);
        }
        catch (error) {
            if (error.response) {
                if (error.response.status === 422) {
                    console.log(error.response.status);
                }
            }
        }
    }

    useEffect(() => {
        messageRef.current?.scrollIntoView({ behavior: 'instant' });
    }, [comms]);

    useEffect(() => {
        document.title = 'Request Communication';
        axios.get(`http://localhost:8000/api/requestcommunication/${id}`,
            { withCredentials: true })
            .then(res => {
                setRequestStatus(res.data.statusRequest)
                setComms(res.data.data);
                setLoading(false);
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 403) {
                        setComms(403);
                        setLoading(false);
                    }
                    if (error.response.status === 422) {
                        setComms(error.response.data.message);
                        setLoading(false);
                    }
                }
            });
        socket.on("sendChatToClient", ([message, sendername]) => {
            setComms((state) =>
                [
                    ...state,
                    {
                        id: message.id,
                        idRequest: message.idRequest,
                        idSender: message.idSender,
                        message: message.message,
                        created_at: message.created_at,
                        updated_at: message.updated_at,
                        firstName: sendername,
                    },
                ]);
        });

        return () => socket.off('receive_message');

    }, [socket]);
    let menu;
    {
        userid === null ?
            menu = (
                <Login />
            )
            :
            menu = (
                <div className="container mt-3">
                    {loading && <Loading />}
                    {
                        !loading &&
                        <div className="row">
                            <div className="col-md-12" style={{
                                border: "1px solid #ccc",
                                maxHeight: "800px",
                                overflowY: "scroll",
                                borderRadius: "5px",
                            }}>
                                {comms && comms.constructor === Array && comms.map((comm, index, arr) => {
                                    let messageSentDate = moment(comm.created_at);
                                    let messageSeenDate = moment(comm.updated_at);
                                    const previousItem = arr[index - 1];
                                    return (
                                        <div key={index}>
                                            {index == 0 && String(comm.idSender) !== String(userid) &&
                                                <span>{comm.firstName}</span>
                                            }
                                            {index > 0 && String(comm.idSender) !== String(previousItem.idSender)
                                                && String(comm.idSender) !== String(userid) &&
                                                <span>{comm.firstName}</span>
                                            }
                                            <div className="messageBox mt-1" key={index} style={{
                                                backgroundColor: String(userid) === String(comm.idSender) ? "#78b5ff" : "#f5f3f0",
                                                width: "fit-content",
                                                padding: "7px",
                                                borderRadius: "7px",
                                                marginRight: String(userid) === String(comm.idSender) ? "0" : "",
                                                marginLeft: String(userid) === String(comm.idSender) ? "auto" : "",

                                            }}>
                                                <p style={{
                                                    margin: "0",
                                                    padding: "0"
                                                }}>
                                                    {comm.message}
                                                </p>
                                                
                                            </div>
                                            <div style={{
                                                    fontSize: "9px",
                                                    textAlign: String(comm.idSender) == String(userid) ? "right" : "left"
                                                }}>
                                                    {
                                                        `Sent ${messageSentDate.format('MMM DD YYYY h:mm A ')}`

                                                    }
                                                    {
                                                        comm.isRead && String(comm.idSender) === String(userid)
                                                            ?
                                                            `Seen ${messageSeenDate.format('MMM DD YYYY h:mm A')}`
                                                            :
                                                            null
                                                    }
                                                </div>

                                        </div>

                                    )
                                })
                                }

                                {comms.length < 1 && <>No messages.</>}
                                {requestStatus === 'Closed' ?
                                    <p ref={messageRef} style={{ textAlign: "center", marginTop: "20px" }}>This request has been closed
                                        due to the item being unavailable at the moment, please make a request again or contact
                                        the admin if you have any question.</p>
                                    :
                                    <div className="mt-2 mb-2">
                                        <input type="text" ref={messageRef} required id="message" placeholder="Enter a message" name="message"
                                            value={requestData.message} onChange={handleChange} className="form-control"
                                            style={{
                                                width:
                                                    window.innerWidth > 1450 ?
                                                        (requestData.message !== '' || messageRef.current != null ? "95%" : "100%")
                                                        :
                                                        (requestData.message !== '' || messageRef.current != null ? "85%" : "100%"),
                                                display: "inline-block",
                                            }} />
                                        <button className="btn btn-primary" onClick={sendCommunication} style={{
                                            float: "right",
                                            display: requestData.message !== '' || messageRef.current != null ? "block" : "none",
                                        }}>Send</button>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                </div>
            )
    }

    return (
        <div className="mobile-body">
            {menu}
        </div>
    );
}

export default RequestCommunication;