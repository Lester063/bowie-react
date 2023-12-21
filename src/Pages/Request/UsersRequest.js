import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import useFetch from '../../components/useFetch';
import RequestsList from './RequestsList';
import ForbiddenPage from '../../components/ForbiddenPage';
import axios from 'axios';

const UsersRequest = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isClicked, setClicked] = useState(false);

    const is_admin = localStorage.getItem('is_admin');

    const data = useFetch(`http://localhost:8000/api/requests`, isClicked);

    useEffect(() => {
        document.title = "User's Requests";
        if (data && data !== null && data !== 403) {
            setRequests(data);
            setLoading(false);
            setClicked(false);
        }
    }, [isClicked, data, requests]);

    const actionRequest = async (e, id, action) => {
        e.preventDefault();
        try {
            let response = await axios.put(`http://localhost:8000/api/actionrequest/${id}/edit`, { action: action }, { withCredentials: true });
            setClicked(true);
            console.log(response.data);
        }
        catch(error) {
            alert(error.response.data.message);
        }
    }

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
                            <div className="card">
                                <div className="card-header">
                                    <h4>User's Requests</h4>
                                </div>
                                <div className="card-body">
                                    <RequestsList requests={requests} actionRequest={actionRequest}/>
                                    {requests.length < 1 && <p>No request to fetch.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
        )
    } else {
        menu = (
            <ForbiddenPage />
        )
    }

    return (
        <>
            {menu}
        </>
    );
}

export default UsersRequest;