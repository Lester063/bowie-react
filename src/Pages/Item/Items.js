import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../../components/Loading';
import useFetch from '../../components/useFetch';
import ItemList from './ItemList';

const Items = () => {
    const [items, setItem] = useState([]);
    const [getItems, setNewItem] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isClicked, setClicked] = useState(false);

    const is_admin = localStorage.getItem('is_admin');
    const userid = localStorage.getItem('userid');

    const data = useFetch(`http://localhost:8000/api/items`, isClicked);

    useEffect(() => {
        document.title = 'Items';
        if (data.constructor === Array) {
            setItem(data);
            setLoading(false);
            setClicked(false);
            console.log(data);
        }
    }, [data]);

    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            const checkRequest = await axios.get(`http://localhost:8000/api/items/${id}/itemrequest`, { withCredentials: true });
            console.log(checkRequest.data.count);
            if(checkRequest.data.count >= 1) {
                console.log('aaaa')
                if (window.confirm('There are existing request, are you sure?')) {
                    const deleteresponse = await axios.delete(`http://localhost:8000/api/items/${id}/delete`, { withCredentials: true });
                    alert(deleteresponse.data.message);
                    console.log(deleteresponse.data);
                    const newItems = items.filter((item) =>
                    item.id !== id
                );
                setItem(newItems);
                }
            } else {
                console.log('ehehe')
                const deleteresponse = await axios.delete(`http://localhost:8000/api/items/${id}/delete`, { withCredentials: true });
                alert(deleteresponse.data.message);
                const newItems = items.filter((item) =>
                item.id !== id
            );
            setItem(newItems);
            }
        } catch(error) {
            console.log(error.response.status);
        }
    }

    const handleRequestItem = (e, iditem) => {
        const requestdata = {
            idrequester: userid,
            iditem: String(iditem),
            statusrequest: 'Pending',
            // isreturnsent: false
        }
        e.preventDefault();
        axios.post(`http://localhost:8000/api/requests/`, requestdata, { withCredentials: true }).then(res => {
            alert(res.data.message);
        })
            .catch(function (error) {
                if (error.response) {
                    if (error.response.status === 422) {
                        console.log(error.response.data.errors)
                    }
                    else if (error.response.status === 400) {
                        alert(error.response.data.message)
                    }
                }
            })
    }

    const filterAvailableItems = (event) => {
        setNewItem(items)
        if (event.target.checked) {
            const newItems = items.filter((item) =>
                item.is_available === 1
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
                            <div className="card">
                                <div className="card-header">
                                    <h4>Item List
                                        {is_admin === '1' &&
                                            <Link to="/item/create" className="btn btn-primary float-end">Add Item</Link>
                                        }
                                    </h4>
                                    <input type="checkbox" onChange={(e) => { filterAvailableItems(e) }} />
                                    <label>Available</label>
                                </div>
                                <div className="card-body">
                                    <ItemList items={items} handleDelete={handleDelete} handleRequestItem={handleRequestItem} />
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
        <>
            {menu}
        </>
    );
}

export default Items;