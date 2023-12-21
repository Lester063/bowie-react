const RequestsList = ({ requests, actionRequest }) => {
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
                            <td><a href={`requestcommunication/${request.id}`}>{request.itemname}</a></td>
                            <td>{request.itemcode}</td>
                            <td><span style=
                                {{
                                    backgroundColor: request.statusrequest === 'Approved' || request.statusrequest === 'Pending' ? '#47bf67' : '#f75036',
                                    padding: "5px",
                                    borderRadius: "5px",
                                    color: "#fff",
                                }}>{request.statusrequest}</span></td>
                            {is_admin === '1' &&
                                <td>
                                    <button className="btn btn-primary" onClick={(e) => {
                                        if (window.confirm('are you sure?')) {
                                            actionRequest(e, request.id, 'Approving');
                                        }
                                    }} disabled={request.statusrequest === 'Approved' ? true : false}>Approve</button>
                                    <button className="btn btn-danger" onClick={(e) => {
                                        if (window.confirm('are you sure?')) {
                                            actionRequest(e, request.id, 'Declining');
                                        }
                                    }} disabled={request.statusrequest === 'Declined' ? true : false}>Decline</button>

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

export default RequestsList;