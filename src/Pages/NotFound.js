import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="notfound">
            <h2>Sorry, Page is not available.</h2>
            <Link to="/">Click here to open homepage...</Link>
        </div>
    );
}

export default NotFound;