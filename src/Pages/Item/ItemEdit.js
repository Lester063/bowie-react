import { useParams, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../../components/Loading';
import ItemForm from '../../components/ItemForm';
import ForbiddenPage from '../../components/ForbiddenPage';

const ItemEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [item, setItem] = useState({
        itemname: "",
        itemcode: "",
        item_image: "",
    });
    const [selectedFile, setSelectedFile] = useState(null);

    const [loading, setLoading] = useState(false);
    const [inputError, setInputError] = useState({});

    const is_admin = localStorage.getItem('is_admin');

    //input changes
    const handleChange = (e) => {
        e.preventDefault();
        setItem({...item, [e.target.name]: e.target.value});
    }

    //file changes
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    useEffect(()=>{
        async function getItemData(){
            try {
                const itemdata = await axios.get(`http://localhost:8000/api/items/${id}/edit`,{withCredentials:true, headers: {
                    'contentType': 'multipart/form-data',
                },});
                setItem(itemdata.data.data);
                setLoading(false);
            }
            catch (error){
                console.log('error: '+error);
            }
        }
        getItemData();
    },[id]);

    useEffect(() => {
        if (is_admin === null) {
            navigate('/login');
        }
    }, [is_admin]);

    const saveNewItemData = async (e) =>{
        e.preventDefault();
        setLoading(true);

        let data = new FormData()
        data.append("itemname", item.itemname);
        data.append("itemcode", item.itemcode);
        if (selectedFile) {
            data.append('item_image', selectedFile);
        }

        try {
            const response = await axios.post(`http://localhost:8000/api/items/${id}/edit`, data, { withCredentials: true });
            setLoading(false);
            alert(response.data.message);
            navigate('/items');
        }
        catch (error) {
            setLoading(false);
            setInputError(error.response.data.errors);
        }
    }

    let menu;
    if (is_admin === '1') {
        menu = (
            <>
        <form onSubmit={saveNewItemData} encType="multipart/form-data">
            <div className="container mt-3">
                {loading && <Loading />}
                {
                    !loading &&
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card mt-3">
                                <div className="card-header">
                                    <h4>
                                        <Link to="/items" className="btn btn-secondary float-right"><i className="bi bi-arrow-left"></i></Link>
                                        Edit Item
                                    </h4>
                                </div>
                                    <ItemForm item={item} handleChange={handleChange} handleFileChange={handleFileChange} inputError={inputError}/>
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

export default ItemEdit;