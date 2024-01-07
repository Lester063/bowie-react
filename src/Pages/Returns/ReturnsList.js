import { useState } from "react";
import HoverMessage from "../../components/HoverMessage";
import { useLocation } from "react-router-dom";

const ReturnsList = ({ returns, approveReturn }) => {
    const is_admin = localStorage.getItem('is_admin');
    const [message, setMessage] = useState('');
    const url = useLocation();

    const hoverDisabledButton = async (id, isDisabled) => {
        if (isDisabled) {
            setMessage('Request for return is already approved.')
            document.getElementById(id).style.display = 'block';
        }
    }

    const hoverOut = async (id) => {
        document.getElementById(id).style.display = 'none';
    }

    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th style={{ width: "10px" }}>List#</th>
                    {!url.pathname.includes('myreturns') &&
                        <th>Returner's Name</th>
                    }
                    <th>Item Name</th>
                    <th>Item Code</th>
                    <th>Return Status</th>
                    {is_admin === '1' &&
                        <th>Action</th>
                    }
                </tr>
            </thead>
            <tbody>
                {returns && returns.map((returnn, index) => {
                    return (
                        <tr key={index}>
                            <td>{index + 1}.</td>
                            {!url.pathname.includes('myreturns') &&
                                <td>{returnn.name}</td>
                            }
                            <td><a href={`requestcommunication/${returnn.idrequest}`}>{returnn.itemname}</a></td>
                            <td>{returnn.itemcode}</td>
                            <td><span style={{
                                backgroundColor: '#47bf67',
                                padding: "5px",
                                borderRadius: "5px",
                                color: "#fff",
                            }}>{returnn.is_approve === 1 ? 'Approved' : 'Pending'}</span></td>
                            {is_admin === '1' &&
                                <td>
                                    <HoverMessage id={index + 'approvereturn'} message={message} />
                                    <span onMouseOut={() => { hoverOut(index + 'approvereturn') }}
                                        onMouseOver={() => {
                                            hoverDisabledButton(index + 'approvereturn', returnn.is_approve === 1 ? true : false)
                                        }}>
                                        <button className="btn btn-primary" disabled={returnn.is_approve === 1 ? true : false}
                                            onClick={(e) => {
                                                if (window.confirm('are you sure?')) {
                                                    approveReturn(e, returnn.id)
                                                }
                                            }
                                            }
                                        ><i className="bi bi-check-circle"></i></button>
                                    </span>
                                </td>
                            }
                        </tr>
                    )
                })
                }
            </tbody>

        </table>
    );
}

export default ReturnsList;