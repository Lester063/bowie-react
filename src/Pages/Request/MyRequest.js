import React, { useEffect, useState, createContext } from 'react';
import Loading from '../../components/Loading';
import useFetch from '../../components/useFetch';
import RequestsList from './RequestsList';
import Login from "../Auth/Login";

export const RequestContext = createContext(null);
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

    let menu;
    {
        userid === null ?
            menu = (
                <Login />
            )
            :
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
                                            <h4>My Requests</h4>
                                        </div>
                                        <div className="card-body">
                                            <RequestsList />
                                            {requests.length < 1 && <p>No request to fetch.</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </>
            )
    }

    return (
        <RequestContext.Provider value={requests}>
            <div className="mobile-body">
                {menu}
            </div>
        </RequestContext.Provider>
    );
}

export default MyRequest;