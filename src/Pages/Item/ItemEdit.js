import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../../components/Loading';
import { useNavigate } from 'react-router-dom';
import ItemForm from '../../components/ItemForm';
import ForbiddenPage from '../../components/ForbiddenPage';

const ItemEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [item, setItem] = useState({
        itemname: "",
        itemcode: "",
    });
    const [loading, setLoading] = useState(false);
    const [inputError, setInputError] = useState({});

    const is_admin = localStorage.getItem('is_admin');

    //input changes
    const handleChange = (e) => {
        e.preventDefault();
        setItem({...item, [e.target.name]: e.target.value});
    }

    useEffect(()=>{
        async function getItemData(){
            try {
                const itemdata = await axios.get(`http://localhost:8000/api/items/${id}/edit`,{withCredentials:true});
                setItem(itemdata.data.data);
                setLoading(false);
            }
            catch (error){
                console.log('error: '+error);
            }
        }
        getItemData();
    },[id])

    const saveNewItemData = async (e) =>{
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8000/api/items/${id}/edit`, item,{withCredentials:true});
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
        <form onSubmit={saveNewItemData}>
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
                                    <ItemForm item={item} handleChange={handleChange} inputError={inputError}/>
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

export default ItemEdit;