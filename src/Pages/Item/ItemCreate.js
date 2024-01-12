import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import Loading from '../../components/Loading';
import ItemForm from '../../components/ItemForm';
import ForbiddenPage from '../../components/ForbiddenPage';

const ItemCreate = () => {
    const [inputError, setInputError] = useState({});
    const [loading, setLoading] = useState(false);

    const is_admin = localStorage.getItem('is_admin');

    const [item, setItem] = useState({
        itemname: "",
        itemcode: "",
    });

    //input changes
    const handleChange = (e) => {
        e.preventDefault();
        setItem({ ...item, [e.target.name]: e.target.value });
    }

    //click save button
    const saveItem = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            itemname: item.itemname,
            itemcode: item.itemcode,
        }
        try {
            const response = await axios.post(`http://localhost:8000/api/items`, data, { withCredentials: true });
            setLoading(false);
            alert(response.data.message);
            setItem({
                itemname: "",
                itemcode: ""
            });
            setInputError({});
        }
        catch(error) {
            console.log(error)
            setLoading(false);
            setInputError(error.response.data.errors);
        }
    }

    let menu;
    if (is_admin === '1') {
        menu = (
            <>
                <form onSubmit={saveItem}>
                    <div className="container mt-3">
                        {loading && <Loading />}
                        {
                            !loading &&
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="card mt-3">
                                        <div className="card-header">
                                            <h4>
                                                <Link to="/items" className="btn btn-secondary"><i className="bi bi-arrow-left"></i></Link>
                                                Create Item
                                            </h4>
                                        </div>
                                        <ItemForm item={item} handleChange={handleChange} inputError={inputError} />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </form>
            </>
        )
    } else {
        menu = (
            <ForbiddenPage />
        )
    }

    return (
        <div className="mobile-body">
            {menu}
        </div>
    );
}

export default ItemCreate;