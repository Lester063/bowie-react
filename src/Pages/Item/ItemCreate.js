import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../../components/Loading';
import ItemForm from '../../components/ItemForm';
import ForbiddenPage from '../../components/ForbiddenPage';

const ItemCreate = () => {
    const navigate = useNavigate();
    const [inputError, setInputError] = useState({});
    const [loading, setLoading] = useState(false);

    const is_admin = localStorage.getItem('is_admin');

    const [item, setItem] = useState({
        itemname: "",
        itemcode: "",
        item_image: "",
    });
    const [selectedFile, setSelectedFile] = useState(null);

    //input changes
    const handleChange = (e) => {
        e.preventDefault();
        setItem({ ...item, [e.target.name]: e.target.value });
    }
    //file changes
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    //click save button
    const saveItem = async (e) => {
        e.preventDefault();
        setLoading(true);

        let data = new FormData()
        data.append("itemname", item.itemname);
        data.append("itemcode", item.itemcode);
        if (selectedFile) {
            data.append('item_image', selectedFile);
        }

        try {
            const response = await axios.post(`http://localhost:8000/api/items`, data,
                {
                    withCredentials: true,
                    headers: {
                        'contentType': 'multipart/form-data',
                    },
                }
            );

            setLoading(false);
            alert(response.data.message);
            setItem({
                itemname: "",
                itemcode: "",
                item_image: "",
            });
            setInputError({});
        }
        catch (error) {
            console.log(error)
            setLoading(false);
            setInputError(error.response.data.errors);
        }
    }

    useEffect(() => {
        if (is_admin === null) {
            navigate('/login');
        }
    }, [is_admin]);

    let menu;
    if (is_admin === '1') {
        menu = (
            <>
                <form onSubmit={saveItem} encType="multipart/form-data">
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
                                        <ItemForm item={item} handleChange={handleChange} handleFileChange={handleFileChange} inputError={inputError} />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </form>
            </>
        )
    }
    else if (is_admin === '0') {
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