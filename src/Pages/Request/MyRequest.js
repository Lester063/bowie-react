import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import useFetch from '../../components/useFetch';
import RequestsList from './RequestsList';
import axios from 'axios';

const MyRequest = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isClicked, setClicked] = useState(false);

    const data = useFetch(`http://localhost:8000/api/userrequest`, isClicked);

    useEffect(() => {
        document.title = 'My Requests';
        if (data.constructor === Array) {
            setRequests(data);
            setLoading(false);
            setClicked(false);
            console.log(data);
        }
    }, [data]);

    const actionRequest = async (e, id, action) => {
        e.preventDefault();
        try {
            let response = await axios.put(`http://localhost:8000/api/actionrequest/${id}/edit`, { action: action }, { withCredentials: true });
            setClicked(true);
            console.log(response.data);
            alert(response.data.message);
        }
        catch(error) {
            alert(error.response.data.message);
        }
    }

    const returnItem = async (e, idrequest) => {
        e.preventDefault();
        try {
            let response = await axios.post(`http://localhost:8000/api/return`, { idrequest: idrequest }, { withCredentials: true });
            setClicked(true);
            console.log(response.data);
            alert(response.data.message);
        }
        catch(error) {
            alert(error.response.data.message);
        }
    }

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
                                    <RequestsList requests={requests} actionRequest={actionRequest} returnItem={returnItem}/>
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