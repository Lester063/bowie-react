import React, { useEffect, useState, createContext } from 'react';
import Loading from '../../components/Loading';
import useFetch from '../../components/useFetch';
import ReturnsList from './ReturnsList';
import ForbiddenPage from '../../components/ForbiddenPage';
import { useParams } from 'react-router-dom';

export const ViewReturnContext = createContext(null);
const ViewReturn = () => {
    const [returns, setReturns] = useState([]);
    const [isUserHasAccess, setUserAccess] = useState(true);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    const is_admin = localStorage.getItem('is_admin');
    const userid = localStorage.getItem('userid');

    const data = useFetch(`http://localhost:8000/api/return/${id}`);

    useEffect(() => {
        document.title = "View Return";
        if (data.constructor === Array) {
            setReturns(data);
            setLoading(false);
        }
    }, [data]);

    useEffect(() => {
        returns.map((returnn)=>{
            returnn.idreturner == userid || is_admin === '1' ?
            setUserAccess(true)
            :
            setUserAccess(false)
        });
    }, [returns])


    let menu;
    menu = (
        isUserHasAccess ?
            <>
                <div className="container mt-3">
                    {loading && <Loading />}
                    {
                        !loading &&
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card mt-3">
                                    <div className="card-header">
                                        <h4>View Return</h4>
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
            :
            <ForbiddenPage />
    )


    return (
        <ViewReturnContext.Provider value={returns}>
            <div className="mobile-body">
                {menu}
            </div>
        </ViewReturnContext.Provider>
    );
}

export default ViewReturn;