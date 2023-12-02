import { Link } from 'react-router-dom';
const ItemList = ({items, handleDelete}) => {

    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>List#</th>
                    <th>Item Name</th>
                    <th>Item Code</th>
                    <th>Item Status</th>
                    <th colSpan="2">Action</th>
                </tr>
            </thead>
            <tbody>
                {items && items.map((item, index) => {
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.itemname}</td>
                            <td>{item.itemcode}</td>
                            <td>{item.itemstatus}</td>
                            <td style={{width:"220px"}}>
                                <Link to={`/items/${item.id}/edit`} className="btn btn-primary">Edit</Link>
                                <button className="btn btn-danger" style={{marginLeft:"5px"}} onClick={(e) => {
                                    if (window.confirm('are you sure?')) {
                                        handleDelete(e, item.id);
                                    }
                                }}>Delete</button>
                            </td>
                        </tr>
                    )
                })
                }
            </tbody>

        </table>
    );
}
 
export default ItemList;