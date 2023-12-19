import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Loading from '../../components/Loading';
import axios from "axios";
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001');
const RequestCommunication = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [comms, setComms] = useState([]);
    const userid = localStorage.getItem('userid');
    const [getError, setError] = useState('');
    const [isFocus, setFocus] = useState(false);
    const [requestData, setRequestData] = useState({
        idrequest: "",
        message: "",
    });
    const bottomRef = useRef(null);

    //input changes
    const handleChange = (e) => {
        e.preventDefault();
        setRequestData({ ...requestData, [e.target.name]: e.target.value });
    }

    const sendCommunication = async (e) => {
        e.preventDefault();

        const datos = {
            idrequest: id,
            message: requestData.message,
        }

        await axios.post(`http://localhost:8000/api/requestcommunication/`, datos, { withCredentials: true }).then(res => {
            setRequestData({
                idrequest: "",
                message: ""
            });
            document.getElementById('message').focus();
            setFocus(true);
            setComms((state) => [
                ...state,
                {
                    id: res.data.data.id,
                    idrequest: res.data.data.idrequest,
                    idsender: res.data.data.idsender,
                    message: res.data.data.message,
                    created_at: res.data.data.created_at,
                    updated_at: res.data.data.updated_at,
                },
            ]);
            socket.emit("sendChatToServer", res.data.data);
        }).catch((error) => {
            if (error.response) {
                if (error.response.status === 422) {
                    setError(error.response.status);
                    console.log(getError);
                }
            }
        })
    }

    useEffect(() => {
        //scroll to bottom every time messages change
        bottomRef.current?.scrollIntoView({ behavior: 'instant' });
    }, [comms]);

    useEffect(() => {
        document.title = 'Request Communication';
        axios.get(`http://localhost:8000/api/requestcommunication/${id}`,
            { withCredentials: true })
            .then(res => {
                setComms(res.data.message);
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
        socket.on("sendChatToClient", (message) => {
            setComms((state) => [
                ...state,
                {
                    id: message.id,
                    idrequest: message.idrequest,
                    idsender: message.idsender,
                    message: message.message,
                    created_at: message.created_at,
                    updated_at: message.updated_at,
                },
            ]);

        });

        return () => socket.off('receive_message');

    }, [socket]);



    return (
        <div className="container mt-3">
            {loading && <Loading />}
            {
                !loading &&
                <div className="row">
                    <div className="col-md-12" style={{
                        border: "1px solid #ccc",
                        height: "800px",
                        overflowY: "scroll",
                        borderRadius: "5px",
                    }}>
                        {comms && comms.constructor === Array && comms.map((comm, index, arr) => {                           
                            const previousItem = arr[index - 1];
                            return (
                                <div key={index}>
                                {index==0 && comm.name}
                                {index>0 && comm.idsender !== previousItem.idsender && comm.idsender !== userid &&
                                <span>{comm.name}</span>
                                }
                                <div className="messageBox mt-1" key={index} style={{
                                    backgroundColor: String(userid) === String(comm.idsender) ? "#78b5ff" : "#f5f3f0",
                                    width: "fit-content",
                                    padding: "10px",
                                    borderRadius: "7px",
                                    marginRight:String(userid) === String(comm.idsender) ? "0" : "",
                                    marginLeft:String(userid) === String(comm.idsender) ? "auto" : "",

                                }}>
                                    <p>{comm.message}</p>
                                </div>
                                </div>
                            )
                        })
                        }

                        {comms.constructor !== Array && <>{comms}</>}
                        <div className="mt-2 mb-2">
                            <input type="text" ref={bottomRef} required id="message" placeholder="Enter a message" name="message" value={requestData.message} onChange={handleChange} className="form-control" style={{
                                width: (requestData.message !== '' || isFocus === true ? "95%" : "100%"),
                                display: "inline-block",
                                }} />
                            <button className="btn btn-primary" onClick={sendCommunication} style={{
                                float: "right", 
                                display: requestData.message !== '' || isFocus === true ? "block" : "none",
                                }}>{window.innerWidth > 1450 ? 'Send' : 'S' }</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default RequestCommunication;