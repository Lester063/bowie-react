const ReviewForm = () => {
    return (
        <>
            <form>
                <input type="number" placeholder="Rating" max="5" className="form-control mt-1" name="rating" />
                <input type="text" placeholder="Comment" className="form-control mt-1" name="comment" />
                <input type="hidden" className="form-control mt-1" name="idrequest" />
            </form>
        </>
    );
}

export default ReviewForm;