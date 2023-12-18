import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
                    <div className="col-md-12">
                        <div className="card">
                            <table className="table table-striped" id="tabs">
                                <tbody>
                                    {comms && comms.constructor === Array && comms.map((comm, index) => {
                                        return (
                                            <tr key={index} style={{ textAlign: String(userid) === String(comm.idsender) ? "right" : "left" }}>
                                                <td>{comm.message}</td>
                                            </tr>
                                        )
                                    })
                                    }
                                </tbody>
                            </table>
                            {comms.constructor !== Array && <>{comms}</>}
                            <div>
                            <input type="text" required id="message" placeholder="Enter a message" name="message" value={requestData.message} onChange={handleChange} className="form-control" style={{ width: requestData.message!=='' || isFocus===true ? "95%" : "100%", display: "inline-block" }} />
                            <button className="btn btn-primary" onClick={sendCommunication} style={{ width: "5%",float: "right", display: requestData.message!=='' || isFocus===true ? "block" : "none" }}>Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default RequestCommunication;