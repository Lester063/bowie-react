import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import Loading from '../../components/Loading';
import ItemForm from '../../components/ItemForm';

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
    const saveItem = (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            itemname: item.itemname,
            itemcode: item.itemcode,
        }
        axios.post(`http://localhost:8000/api/items`, data, { withCredentials: true }).then(res => {
            setLoading(false);
            alert(res.data.message);
            setItem({
                itemname: "",
                itemcode: ""
            });
            setInputError({});
        }).catch(function (error) {
            if (error.response) {
                if (error.response.status === 422) {
                    setLoading(false);
                    setInputError(error.response.data.errors);
                    console.log(inputError)
                }
                else if (error.response.status === 500) {
                    setLoading(false);
                    setInputError(error.response.data.message);
                    console.log(inputError)
                }
            }
        });
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
                                    <div className="card">
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
            <p>Forbidden</p>
        )
    }

    return (
        <>
            { menu }
        </>
    );
}

export default ItemCreate;