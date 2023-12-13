const RequestsList = ({ requests }) => {
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th style={{width: "10px"}}>List#</th>
                    <th>Item Name</th>
                    <th>Item Code</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {requests && requests.map((request, index) => {
                    return (
                        <tr key={index}>
                            <td>{index + 1}.</td>
                            <td><a href={`requestcommunication/${request.requestid}`}>{request.itemname}</a>{request.requestid}</td>
                            <td>{request.itemcode}</td>
                            <td>{request.statusrequest}</td>
                        </tr>
                    )
                })
                }
            </tbody>

        </table>
    );
}

export default RequestsList;