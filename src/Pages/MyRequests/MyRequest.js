import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import useFetch from '../../components/useFetch';
import RequestsList from './RequestsList';

const MyRequest = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isClicked, setClicked] = useState(false);

    const data = useFetch(`http://localhost:8000/api/userrequest`, isClicked);

    useEffect(() => {
        document.title = 'My Requests';
        if (data && data !== null && data !== 403) {
            setRequests(data);
            setLoading(false);
            setClicked(false);
            console.log(data);
            console.log(requests);
        }
    }, [isClicked, data, requests]);

    let menu;
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
                                    <h4>My Requests</h4>
                                </div>
                                <div className="card-body">
                                    <RequestsList requests={requests} />
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
        <>
            {menu}
        </>
    );
}

export default MyRequest;