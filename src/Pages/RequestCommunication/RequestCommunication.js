import { useParams } from "react-router-dom";
import useFetch from "../../components/useFetch";
import { useEffect, useState } from "react";
import Loading from '../../components/Loading';

const RequestCommunication = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [isClicked, setClicked] = useState(false);
    const [comms, setComms] = useState();

    const userid = localStorage.getItem('userid');

    const data = useFetch(`http://localhost:8000/api/requestcommunication/${id}`, isClicked);

    useEffect(() => {
        document.title = 'Request Communication';
        if (data.constructor === Array) {
            setComms(data);
            setLoading(false);
            setClicked(false);
            console.log(data);
        }
        else if(data.constructor !== Array) {
            setComms(data);
        }
    }, [isClicked, data, comms]);
    
    const sendCommunication = (e) => {
        e.preventDefault();
    }
    return (
        <div className="container mt-3">
            {loading && <Loading />}
            {
                !loading &&
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <table className="table table-striped">
                                <tbody>
                                    {comms && comms.constructor === Array && comms.map((comm, index) => {
                                        return (
                                            <tr key={index} style={{ textAlign: userid === comm.idsender ? "right" : "left" }}>
                                                <td>{comm.message}</td>
                                            </tr>
                                        )
                                    })
                                    }
                                </tbody>
                            </table>
                            {comms.constructor !== Array && <>{comms}</>}
                            <form onSubmit={sendCommunication}>
                                <input type="text" placeholder="Enter a message" className="form-control" style={{width:"95%", display:"inline-block"}}/>
                                <button type="submit" className="btn btn-primary" style={{float:"right"}}>Send</button>
                            </form>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default RequestCommunication;