const ItemForce = ({ item, handleChange, handleFileChange, inputError }) => {
    return (
        <div className="card-body">
            <div className="mb-3">
                {item.item_image ?
                    <img src={`http://localhost:8000/storage/${item.item_image}`} style={{ width: "250px", height: "250px" }} />
                    :
                    null
                }
            </div>

            <div className="mb-3">
                <label>Item Image</label>
                <input type="file" name="item_image" label="Product Picture" onChange={handleFileChange} />
                <span className="text-danger">{inputError.item_image}</span>
            </div>

            <div className="mb-3">
                <label>Item Name</label>
                <input type="text" name="itemname" value={item.itemname} onChange={handleChange} className="form-control" />
                <span className="text-danger">{inputError.itemname}</span>
            </div>

            <div className="mb-3">
                <label>Item Code</label>
                <input type="text" name="itemcode" value={item.itemcode} onChange={handleChange} className="form-control" />
                <span className="text-danger">{inputError.itemcode}</span>
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
        </div>
    );
}

export default ItemForce;