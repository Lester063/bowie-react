const ItemForce = ({ item, handleChange, handleFileChange, inputError }) => {
    return (
        <div className="card-body">
            <div className="mb-3">
                {item.itemImage ?
                    <img src={`http://localhost:8000/storage/${item.itemImage}`} style={{ width: "250px", height: "250px" }} />
                    :
                    null
                }
            </div>

            <div className="mb-3">
                <label>Item Image</label>
                <input type="file" name="itemImage" label="Product Picture" onChange={handleFileChange} />
                <span className="text-danger">{inputError.itemImage}</span>
            </div>

            <div className="mb-3">
                <label>Item Name</label>
                <input type="text" name="itemName" value={item.itemName} onChange={handleChange} className="form-control" />
                <span className="text-danger">{inputError.itemName}</span>
            </div>

            <div className="mb-3">
                <label>Item Code</label>
                <input type="text" name="itemCode" value={item.itemCode} onChange={handleChange} className="form-control" />
                <span className="text-danger">{inputError.itemCode}</span>
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
        </div>
    );
}

export default ItemForce;