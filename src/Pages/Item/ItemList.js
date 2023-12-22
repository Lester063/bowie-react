import { Link } from 'react-router-dom';
const ItemList = ({ items, handleDelete, handleRequestItem }) => {
    const is_admin = localStorage.getItem('is_admin');
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>List#</th>
                    <th>Item Name</th>
                    <th>Item Code</th>
                    <th>Item Status</th>
                    <th>Action</th>
                    {/* admin view & */}
                    {is_admin === '1' && 
                    <th>User Action</th>
                    }
                </tr>
            </thead>
            <tbody>
                {items && items.map((item, index) => {
                    return (
                        <tr key={index}>
                            <td style={{width: "10px"}}>{index + 1}</td>
                            <td>{item.itemname}</td>
                            <td>{item.itemcode}</td>
                            <td>{item.is_available ? 'Available' : 'Not available'}</td>
                            {is_admin === '1' &&
                                <td style={{ width: "220px" }}>
                                    <Link to={`/items/${item.id}/edit`} className="btn btn-primary">Edit</Link>
                                    <button className="btn btn-danger" style={{ marginLeft: "5px" }} onClick={(e) => {
                                        if (window.confirm('are you sure?')) {
                                            handleDelete(e, item.id);
                                        }
                                    }}>Delete</button>
                                </td>
                            }
                            {/* {is_admin === '0' && */}
                            <td style={{ width: "220px" }}>
                                <button className="btn btn-primary" style={{ marginLeft: "5px" }} disabled = {item.is_available ? false : true} 
                                    onClick={(e) => {
                                        if (window.confirm('are you sure?')) {
                                            handleRequestItem(e, item.id);
                                        }
                                    }}
                                
                                >Request</button>
                                </td>
                            {/* } */}
                            
                        </tr>
                    )
                })
                }
            </tbody>

        </table>
    );
}

export default ItemList;