import React, { useEffect, useState, createContext } from 'react';
import Loading from '../../components/Loading';
import useFetch from '../../components/useFetch';
import ReturnsList from './ReturnsList';
import ModalTemplate from "../../components/ModalTemplate";

export const MyReturnContext = createContext(null);
const MyReturn = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    const data = useFetch(`http://localhost:8000/api/userreturns`);

    useEffect(() => {
        document.title = 'My Returns';
        if (data.constructor === Array) {
            setReturns(data);
            setLoading(false);
        }
    }, [data]);

    let menu;
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
                                <ModalTemplate title="Review"/>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )

    return (
        <MyReturnContext.Provider value={returns}>
            <div className="mobile-body">
                {menu}
            </div>
        </MyReturnContext.Provider>
    );
}

export default MyReturn;