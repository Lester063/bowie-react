import React, { useEffect, useState, createContext } from 'react';
import { useNavigate } from "react-router-dom";
import Loading from '../../components/Loading';
import useFetch from '../../components/useFetch';
import ReturnsList from './ReturnsList';

export const MyReturnContext = createContext(null);
const MyReturn = () => {
    const navigate = useNavigate();
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const userid = localStorage.getItem('userid');

    const data = useFetch(`http://localhost:8000/api/userreturns`);

    useEffect(() => {
        document.title = 'My Returns';
        if (data.constructor === Array) {
            setReturns(data);
            setLoading(false);
        }
    }, [data]);

    useEffect(() => {
        if (userid === null) {
            navigate('/login');
        }
    }, [userid]);

    let menu;
    {
        if (userid !== null) {
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
                                            <h4>My Returns</h4>
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
    }

    return (
        <MyReturnContext.Provider value={returns}>
            <div className="mobile-body">
                {menu}
            </div>
        </MyReturnContext.Provider>
    );
}

export default MyReturn;