import React, { useEffect, useState, createContext } from 'react';
import Loading from '../../components/Loading';
import useFetch from '../../components/useFetch';
import RequestsList from './RequestsList';
import { useParams, useNavigate } from 'react-router-dom';
import ForbiddenPage from '../../components/ForbiddenPage';

export const ViewRequestContext = createContext(null);
const ViewRequest = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [isUserHasAccess, setUserAccess] = useState(true);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const is_admin = localStorage.getItem('is_admin');
    const userid = localStorage.getItem('userid');

    const data = useFetch(`http://localhost:8000/api/userrequest/${id}`);

    useEffect(() => {
        document.title = 'View Request';
        if (data.constructor === Array) {
            setRequests(data);
            setLoading(false);
        }
    }, [data]);

    useEffect(() => {
        if (userid === null) {
            navigate('/login');
        }
        requests.map((request)=>{
            request.idrequester == userid || is_admin === '1' ?
            setUserAccess(true)
            :
            setUserAccess(false)
        });
    }, [requests, userid])

    
    let menu;
    menu = (
        isUserHasAccess ?
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
            :
            <ForbiddenPage />
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