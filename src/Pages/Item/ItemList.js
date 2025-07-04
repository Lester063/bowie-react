import { Link } from 'react-router-dom';
import { useState } from "react";
import HoverMessage from "../../components/HoverMessage";

const ItemList = ({ items, handleDelete, handleRequestItem, myRequest }) => {
    const isAdmin = localStorage.getItem('isAdmin');
    const [message, setMessage] = useState('');

    const hoverDisabledButton = async (id, message, isDisabled) => {
        if (isDisabled) {
            switch (message) {
                case 'Request':
                    setMessage('Item might not be available or you have a pending request.')
                    document.getElementById(id).style.display = 'block';
                    break;
                case 'Delete':
                    setMessage('Cannot delete item that is currently assigned to user.')
                    document.getElementById(id).style.display = 'block';
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
                    {isAdmin && //isAdmin means there is a user logged in, either a normal user or admin
                        <th>Action</th>
                    }
                    {isAdmin === '1' && //logged in user must be an admin
                        <th>User Action</th>
                    }
                </tr>
            </thead>
            <tbody>
                {items && items.map((item, index) => {
                    let isRequested = false;

                    myRequest.map((myreq) => {
                        if (String(myreq.idItem) === String(item.id) && myreq.statusRequest === 'Pending') {
                            isRequested = true
                        }
                        return isRequested;
                    })

                    return (
                        <tr key={index}>
                            <td style={{ width: "10px" }}>{index + 1}</td>
                            <td><a href={`/items/${item.id}`}>{item.itemName}</a></td>
                            <td>{item.itemCode}</td>
                            <td>{item.isAvailable ? 'Available' : 'Not available'}</td>
                            {isAdmin === '1' &&
                                <td style={{ width: "220px" }}>
                                    <Link to={`/items/${item.id}/edit`} className="btn btn-primary"><i className="bi bi-pencil-square"></i></Link>
                                    <>
                                        <HoverMessage id={index + 'delete'} message={message} />
                                        <span onMouseOut={() => { hoverOut(index + 'delete') }} onMouseOver={() => {
                                            hoverDisabledButton(index + 'delete', 'Delete', item.isAvailable ? false : true)
                                        }}>
                                        <button className="btn btn-danger" style={{ marginLeft: "5px" }} disabled={!item.isAvailable} onClick={(e) => {
                                        if (window.confirm('are you sure?')) {
                                            handleDelete(e, item.id);
                                        }
                                    }}><i className="bi bi-trash"></i></button>
                                        </span>
                                    </>

                                </td>
                            }
                            {isAdmin &&
                                <td style={{ width: "220px" }}>
                                    <>
                                        <HoverMessage id={index + 'request'} message={message} />
                                        <span onMouseOut={() => { hoverOut(index + 'request') }} onMouseOver={() => {
                                            hoverDisabledButton(index + 'request', 'Request', item.isAvailable && !isRequested ? false : true)
                                        }}>
                                            <button className="btn btn-primary" style={{ marginLeft: "5px" }} disabled={item.isAvailable && !isRequested ? false : true}
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