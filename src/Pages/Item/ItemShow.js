import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../../components/Loading';

const ItemShow = () => {
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [item, setItem] = useState([]);
    const [itemReviews, setItemReview] = useState([]);

    const fetchDataItem = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/items/${id}`, { withCredentials: true });
            setItem(response.data.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    const fetchDataItemReview = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/itemreviews/${id}`, { withCredentials: true });
            setItemReview(response.data.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        document.title = 'Item';
        fetchDataItem();
        fetchDataItemReview();
        setLoading(false);
    }, []);

    return (
        <div className="mobile-body">
            <div className="container">
                {loading && <Loading />}
                <div className="row mt-3">
                    <h3>{item.itemname}</h3>
                    <div className="col-6" style={{ maxHeight: "400px" }}>
                        {item &&
                            <>
                                {item.item_image ?
                                    <img src={`http://localhost:8000/storage/${item.item_image}`} alt="Item Image"
                                        style={{
                                            maxHeight: "100%",
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

                <h3>Comments/Reviews</h3>
                <hr />
                {itemReviews && itemReviews.length >= 1 &&
                    itemReviews.map((itemReview, index) => {
                        return (
                            <div className="row mt-3" key={index} >
                                <div className="col-1 order-1">
                                    <img src={`http://localhost:8000/storage/${itemReview.profile_image}`}
                                        style={{
                                            width: "100px",
                                            borderRadius: "100%",
                                        }}
                                    />
                                </div>
                                <div className="col-11 order-2">
                                    <div className="mb-ml-65px">
                                        <b>{itemReview.first_name} - {itemReview.rating}</b>
                                        <p>{itemReview.comment}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                {itemReviews <= 0 && <p>No comments/reviews available for this item.</p>}
            </div>
        </div>
    );
}

export default ItemShow;