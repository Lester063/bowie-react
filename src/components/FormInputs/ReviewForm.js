import { useEffect, useState, useContext } from "react";
import { MyIdRequestContext } from "../../Pages/Returns/ReturnsList";
import axios from 'axios';
const ReviewForm = () => {
    const getidRequest = useContext(MyIdRequestContext);
    const [review, setReview ] = useState({
        rating: "",
        comment: "",
        idrequest: "",
    });

    useEffect(() => {
        setReview({ ...review, idrequest:  getidRequest});
    }, [getidRequest]);

    const submitReview = async (e) => {
        e.preventDefault();
        const data = {
            rating: Number(review.rating),
            comment: review.comment,
            idrequest: review.idrequest,
        }
        try {
            const response = await axios.post(`http://localhost:8000/api/comment`, data, { withCredentials: true });
            alert(response.data.message);
            console.log(response.data.data)
        }catch(error) {
            console.log(error);
        }
    }

    const handleChange = async (e) => {
        e.preventDefault();
        setReview({ ...review, [e.target.name]: e.target.value });
    }
    return (
        <>
            {review.idrequest &&
                <form onSubmit = {submitReview}>
                    <input type="text" placeholder="Rating" className="form-control mt-1" name="rating" value={review.rating} onChange = {handleChange} />
                    <input type="text" placeholder="Comment" className="form-control mt-1" name="comment" value={review.comment} onChange = {handleChange} />
                    <input type="text" className="form-control mt-1" value={review.idrequest} name="idrequest" onChange = {handleChange} />

                    <button type="submit" className="btn btn-primary mt-1 float-end">Save review</button>
                </form>
            }

        </>
    );
}

export default ReviewForm;