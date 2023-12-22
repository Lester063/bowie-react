import { useState } from "react";
import HoverMessage from "../../components/HoverMessage";

const RequestsList = ({ requests, actionRequest }) => {
    const is_admin = localStorage.getItem('is_admin');

    const [message, setMessage] = useState('')

    const hoverDisabledButton = async (id, statusrequest, isDisabled) => {
        if(isDisabled) {
            console.log(isDisabled)
            switch (statusrequest) {
                case 'Approved':
                    setMessage('Request is already approved.')
                    document.getElementById(id).style.display = 'block';
                    break;
                case 'Closed':
                    setMessage('Request is already closed.')
                    document.getElementById(id).style.display = 'block';
                    break;
                case 'Declined':
                    setMessage('Request is already declined.')
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
                    <th style={{ width: "10px" }}>List#</th>
                    <th>Requester's Name</th>
                    <th>Item Name</th>
                    <th>Item Code</th>
                    <th>Item Status</th>
                    <th>Request Status</th>
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
                            <td>{request.name}</td>
                            <td><a href={`requestcommunication/${request.id}`}>{request.itemname}</a></td>
                            <td>{request.itemcode}</td>
                            <td>{request.is_available === 1 ? 'Available' : 'Not available'}</td>
                            <td><span style=
                                {{
                                    backgroundColor: request.statusrequest === 'Approved' || request.statusrequest === 'Pending' ? '#47bf67' : '#f75036',
                                    padding: "5px",
                                    borderRadius: "5px",
                                    color: "#fff",
                                }}>{request.statusrequest}</span></td>
                            {is_admin === '1' &&
                                <td>
                                    <HoverMessage id={index+'approve'} message={message} />
                                    <span onMouseOut={() => { hoverOut(index + 'approve') }} onMouseOver={() => {
                                        hoverDisabledButton(index + 'approve', request.statusrequest, request.statusrequest === 'Approved' || request.statusrequest === 'Closed' ? true : false)
                                    }}>
                                        <button id='approvebutton' className="btn btn-primary" onClick={(e) => {
                                            if (window.confirm('are you sure?')) {
                                                actionRequest(e, request.id, 'Approving');
                                            }
                                        }} disabled={request.statusrequest === 'Approved' || request.statusrequest === 'Closed' ? true : false}>Approve</button>
                                    </span>

                                    <HoverMessage id={index+'decline'} message={message} />
                                    <span onMouseOut={() => { hoverOut(index + 'decline') }} onMouseOver={() => {
                                        hoverDisabledButton(index + 'decline', request.statusrequest, request.statusrequest === 'Declined' || request.statusrequest === 'Closed' ? true : false)
                                    }}>
                                        <button className="btn btn-danger" onClick={(e) => {
                                            if (window.confirm('are you sure?')) {
                                                actionRequest(e, request.id, 'Declining');
                                            }
                                        }} disabled={request.statusrequest === 'Declined' || request.statusrequest === 'Closed' ? true : false}>Decline</button>
                                    </span>

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