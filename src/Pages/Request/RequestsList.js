const RequestsList = ({ requests }) => {
    const is_admin = localStorage.getItem('is_admin');
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th style={{ width: "10px" }}>List#</th>
                    <th>Item Name</th>
                    <th>Item Code</th>
                    <th>Status</th>
                    {is_admin === '1' &&
                        <th>Action</th>
                    }
                </tr>
            </thead>
            <tbody>
                {requests && requests.map((request, index) => {
                    return (
                        <tr key={index}>
                            <td>{index + 1}.</td>
                            <td><a href={`requestcommunication/${request.requestid}`}>{request.itemname}</a></td>
                            <td>{request.itemcode}</td>
                            <td>{request.statusrequest}</td>
                            <td><i class="fa-solid fa-ellipsis-vertical"></i></td>

                        </tr>
                    )
                })
                }
            </tbody>

        </table>
    );
}

export default RequestsList;