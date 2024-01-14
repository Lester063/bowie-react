import React, { useEffect, useState, createContext } from 'react';
import Loading from '../../components/Loading';
import useFetch from '../../components/useFetch';
import RequestsList from './RequestsList';
import { useParams } from 'react-router-dom';

export const ViewRequestContext = createContext(null);
const ViewRequest = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    const data = useFetch(`http://localhost:8000/api/userrequest/${id}`);

    useEffect(() => {
        document.title = 'View Request';
        if (data.constructor === Array) {
            setRequests(data);
            setLoading(false);
        }
    }, [data]);

    let menu;
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
                                    <h4>View Request</h4>
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

    return (
        <ViewRequestContext.Provider value={requests}>
            <div className="mobile-body">
                {menu}
            </div>
        </ViewRequestContext.Provider>
    );
}

export default ViewRequest;