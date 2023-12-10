import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../../components/Loading';
import useFetch from '../../components/useFetch';
import ItemList from './ItemList';

const Items = () => {
    const [items, setItem] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isClicked, setClicked] = useState(false);

    const is_admin = localStorage.getItem('is_admin');

    const data = useFetch(`http://localhost:8000/api/items`, isClicked);

    useEffect(() => {
        document.title = 'Items';
        if (data && data !== null && data !== 403) {
            setItem(data);
            setLoading(false);
            setClicked(false);
            console.log(data);
        }
    }, [isClicked, data]);

    const handleDelete = (e, id) => {
        e.preventDefault();
        axios.delete(`http://localhost:8000/api/items/${id}/delete`, { withCredentials: true }).then(res => {
            alert(res.data.message);
            setClicked(true);
        })
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
                                        <h4>Item List
                                            <Link to="/item/create" className="btn btn-primary float-end">Add Item</Link>
                                        </h4>
                                    </div>
                                    <div className="card-body">
                                        <ItemList items={items} handleDelete={handleDelete} />
                                        {items.length < 1 && <p>No item to fetch.</p>}
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
            <p>Forbidden</p>
        )
    }

    return (
        <>
            {menu}
        </>
    );
}

export default Items;