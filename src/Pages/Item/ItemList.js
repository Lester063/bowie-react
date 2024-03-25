import { Link } from 'react-router-dom';
import { useState } from "react";
import HoverMessage from "../../components/HoverMessage";

const ItemList = ({ items, handleDelete, handleRequestItem, myRequest }) => {
    const is_admin = localStorage.getItem('is_admin');
    const [message, setMessage] = useState('');

    const hoverDisabledButton = async (id, message, isDisabled) => {
        if (isDisabled) {
            switch (message) {
                case 'Request':
                    setMessage('Item might not be available or you have a pending request.')
                    document.getElementById(id).style.display = 'block';
                    break;
                default: break;
            }
        }
    }

    const hoverOut = async (id) => {
        document.getElementById(id).style.display = 'none';
    }

    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>List#</th>
                    <th>Item Name</th>
                    <th>Item Code</th>
                    <th>Item Status</th>
                    {is_admin && //is_admin means there is a user logged in, either a normal user or admin
                        <th>Action</th>
                    }
                    {is_admin === '1' && //logged in user must be an admin
                        <th>User Action</th>
                    }
                </tr>
            </thead>
            <tbody>
                {items && items.map((item, index) => {
                    let isRequested = false;

                    myRequest.map((myreq) => {
                        if (String(myreq.iditem) === String(item.id) && myreq.statusrequest === 'Pending') {
                            isRequested = true
                        }
                        return isRequested;
                    })

                    return (
                        <tr key={index}>
                            <td style={{ width: "10px" }}>{index + 1}</td>
                            <td><a href={`/items/${item.id}`}>{item.itemname}</a></td>
                            <td>{item.itemcode}</td>
                            <td>{item.is_available ? 'Available' : 'Not available'}</td>
                            {is_admin === '1' &&
                                <td style={{ width: "220px" }}>
                                    <Link to={`/items/${item.id}/edit`} className="btn btn-primary"><i className="bi bi-pencil-square"></i></Link>
                                    <button className="btn btn-danger" style={{ marginLeft: "5px" }} onClick={(e) => {
                                        if (window.confirm('are you sure?')) {
                                            handleDelete(e, item.id);
                                        }
                                    }}><i className="bi bi-trash"></i></button>
                                </td>
                            }
                            {is_admin &&
                                <td style={{ width: "220px" }}>
                                    <>
                                        <HoverMessage id={index + 'request'} message={message} />
                                        <span onMouseOut={() => { hoverOut(index + 'request') }} onMouseOver={() => {
                                            hoverDisabledButton(index + 'request', 'Request', item.is_available && !isRequested ? false : true)
                                        }}>
                                            <button className="btn btn-primary" style={{ marginLeft: "5px" }} disabled={item.is_available && !isRequested ? false : true}
                                                onClick={(e) => {
                                                    if (window.confirm('are you sure?')) {
                                                        handleRequestItem(e, item.id);
                                                    }
                                                }}
                                            ><i className="bi bi-bag-plus"></i></button>
                                        </span>
                                    </>
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

export default ItemList;