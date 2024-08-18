import React, { useEffect, useState, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import useFetch from '../../components/useFetch';
import ReturnsList from './ReturnsList';
import ForbiddenPage from '../../components/ForbiddenPage';

export const UsersReturnContext = createContext(null);
const UsersReturn = () => {
    const navigate = useNavigate();
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    const isAdmin = localStorage.getItem('isAdmin');

    const data = useFetch(`http://localhost:8000/api/returns`);

    useEffect(() => {
        document.title = "User's Return";
        if (data.constructor === Array) {
            setReturns(data);
            setLoading(false);
            console.log(data);
        }
    }, [data]);

    useEffect(() => {
        if (isAdmin === null) {
            navigate('/login');
        }
    }, [isAdmin]);

    let menu;
    if (isAdmin === '1') {
        menu = (
            <>
                <div className="container mt-3">
                    {loading && <Loading />}
                    {
                        !loading &&
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card mt-3">
                                    <div className="card-header">
                                        <h4>User's Returns</h4>
                                    </div>
                                    <div className="card-body">
                                        <ReturnsList />
                                        {returns.length < 1 && <p>No returns to fetch.</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </>
        )
    }
    else if (isAdmin === '0') {
        menu = (
            <ForbiddenPage />
        )
    }

    return (
        <UsersReturnContext.Provider value={returns}>
            <div className="mobile-body">
                {menu}
            </div>
        </UsersReturnContext.Provider>
    );
}

export default UsersReturn;