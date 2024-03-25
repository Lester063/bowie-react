import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../../components/Loading';

const ItemShow = () => {
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [item, setItem] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/items/${id}`, { withCredentials: true });
            setItem(response.data.data);
        }
        catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        document.title = 'Item';
        fetchData();
        setLoading(false);
    }, []);

    return (
        <div className="container">
            {loading && <Loading />}
            <div className="row mt-3">
                <h3>{item.itemname}</h3>
                <div className="col-6" style={{maxHeight:"400px"}}>
                    {item &&
                        <>
                            {item.item_image ? 
                                <img src={`http://localhost:8000/storage/${item.item_image}`} alt="Item Image" 
                                style={{
                                    maxHeight:"100%",
                                    maxWidth: "100%"
                                }} 
                                />
                                :
                                <p>No image available for this item.</p>
                            }
                        </>
                    }
                </div>
            </div>

            <div className="row mt-3">
                <h3>Comments/Reviews</h3>
                <div className="col-12">
                    <b>Lester</b>
                    <p>This is shit.</p>
                </div>
            </div>
        </div>

    );
}

export default ItemShow;