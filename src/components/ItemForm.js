const ItemForce = ({item, handleChange, inputError}) => {
    return (
        <div className="card-body">
            <span className="text-danger">{inputError.message}</span>
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