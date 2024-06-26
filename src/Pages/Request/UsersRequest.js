import React, { useEffect, useState, createContext } from 'react';
import Loading from '../../components/Loading';
import useFetch from '../../components/useFetch';
import RequestsList from './RequestsList';
import ForbiddenPage from '../../components/ForbiddenPage';
import { useNavigate } from 'react-router-dom';

export const UsersRequestContext = createContext(null);

const UsersRequest = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const is_admin = localStorage.getItem('is_admin');

    const data = useFetch(`http://localhost:8000/api/requests`);

    useEffect(() => {
        document.title = "User's Requests";
        if (data.constructor === Array) {
            setRequests(data);
            setLoading(false);
        }
    }, [data]);

    useEffect(() => {
        if (is_admin === null) {
            navigate('/login');
        }
    }, [is_admin]);

    let menu;
    if (is_admin === '1') {
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
                                        <h4>User's Requests</h4>
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
    else if (is_admin === '0') {
        menu = (
            <ForbiddenPage />
        )
    }

    return (
        <UsersRequestContext.Provider value={requests}>
            <div className="mobile-body">
                {menu}
            </div>
        </UsersRequestContext.Provider>
    );
}

export default UsersRequest;