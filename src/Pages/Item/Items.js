import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../../components/Loading';
import useFetch from '../../components/useFetch';
import ItemList from './ItemList';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001');

const Items = () => {
    const [items, setItem] = useState([]);
    const [myRequest, setMyRequest] = useState([]);
    const [getItems, setNewItem] = useState([]);
    const [loading, setLoading] = useState(true);

    const isAdmin = localStorage.getItem('isAdmin');
    const userid = localStorage.getItem('userid');

    const data = useFetch(`http://localhost:8000/api/items`);

    useEffect(() => {
        document.title = 'Items';
        if (data.constructor === Array) {
            setItem(data);
        }
        setLoading(false);
    }, [data]);

    useEffect(() => {
        async function getReq() {
            try {
                const response = await axios.get('http://localhost:8000/api/userrequest', { withCredentials: true });
                setMyRequest(response.data.data);
            }
            catch (error) {
                console.log(error)
            }
        }
        getReq();
    }, []);

    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            const checkRequest = await axios.get(`http://localhost:8000/api/items/${id}/itemrequest`, { withCredentials: true });
            const pendingrequest = checkRequest.data.pendingrequest;
            //check if there is a pending or just closed/completed/approve
            if (checkRequest.data.countpending >= 1) {
                if (window.confirm('Pending request for this item will be automatically closed, are you sure you want to delete the item?')) {
                    //delete all request from checkRequest
                    await pendingrequest.forEach((request) => {
                        axios.put(`http://localhost:8000/api/actionrequest/${request.id}/edit`, { action: 'Closing' }, { withCredentials: true });
                    });
                    const deleteresponse = await axios.delete(`http://localhost:8000/api/items/${id}/delete`, { withCredentials: true });
                    alert(deleteresponse.data.message);
                    console.log(deleteresponse.data);
                    setItem(prevState => prevState.filter(item => item.id !== id))
                }
            } else {
                const deleteresponse = await axios.delete(`http://localhost:8000/api/items/${id}/delete`, { withCredentials: true });
                alert(deleteresponse.data.message);
                setItem(prevState => prevState.filter(item => item.id !== id))
            }
        } catch (error) {
            console.log(error.response.status);
        }
    }

    const handleRequestItem = async (e, idItem) => {
        const requestdata = {
            idRequester: userid,
            idItem: String(idItem),
            statusRequest: 'Pending',
            // isReturnSent: false
        }
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8000/api/requests/`, requestdata, { withCredentials: true });
            alert(response.data.message);
            setMyRequest((req) => [
                ...req,
                {
                    created_at: response.data.data.created_at,
                    id: response.data.data.id,
                    idItem: response.data.data.idItem,
                    idRequester: response.data.data.idRequester,
                    isReturnSent: response.data.data.isReturnSent,
                    statusRequest: response.data.data.statusRequest,
                    updated_at: response.data.data.updated_at
                }
            ]);
            socket.emit("sendNotificationToServer", [response.data.notification]);
        }
        catch (error) {
            if (error.response.status === 422) {
                console.log(error.response.data.errors)
            }
            else if (error.response.status === 400) {
                alert(error.response.data.message)
            }
        }
    }

    const filterAvailableItems = (event) => {
        setNewItem(items)
        if (event.target.checked) {
            const newItems = items.filter((item) =>
                item.isAvailable === 1
            );
            setItem(newItems);
        } else {
            setItem(getItems);
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
                            <div className="card mt-3">
                                <div className="card-header">
                                    <h4>Item List
                                    </h4>
                                    {isAdmin === '1' &&
                                            <Link to="/item/create" className="btn btn-primary float-end">Add Item</Link>
                                        }
                                    <input type="checkbox" onChange={(e) => { filterAvailableItems(e) }} />
                                    <label>Available</label>
                                </div>
                                <div className="card-body">
                                    <ItemList items={items} myRequest={myRequest} handleDelete={handleDelete} handleRequestItem={handleRequestItem} />
                                    {items.length < 1 && <p>No item to fetch.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )

    return (
        <div className="mobile-body">
            {menu}
        </div>
    );
}

export default Items;