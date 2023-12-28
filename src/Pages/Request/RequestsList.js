import { useState } from "react";
import HoverMessage from "../../components/HoverMessage";

const RequestsList = ({ requests, actionRequest, returnItem }) => {
    const is_admin = localStorage.getItem('is_admin');
    const userid = localStorage.getItem('userid');
    const [message, setMessage] = useState('')

    const hoverDisabledButton = async (id, message, isDisabled) => {
        if (isDisabled) {
            switch (message) {
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
                case 'Completed':
                    setMessage('Request is already completed.')
                    document.getElementById(id).style.display = 'block';
                    break;
                case 'Return':
                    setMessage('Request is not approve or return request is already sent.')
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
                    <th>Action</th>
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
                                    backgroundColor: request.statusrequest === 'Approved' || request.statusrequest === 'Pending'
                                        || request.statusrequest === 'Completed' ? '#47bf67' : '#f75036',
                                    padding: "5px",
                                    borderRadius: "5px",
                                    color: "#fff",
                                }}>{request.statusrequest}</span></td>
                            <td>
                                {is_admin === '1' &&
                                    <>
                                        <HoverMessage id={index + 'approve'} message={message} />
                                        <span onMouseOut={() => { hoverOut(index + 'approve') }} onMouseOver={() => {
                                            hoverDisabledButton(index + 'approve', request.statusrequest,
                                                request.statusrequest === 'Approved' || request.statusrequest === 'Closed' || request.statusrequest === 'Completed' ? true : false)
                                        }}>
                                            <button id='approvebutton' className="btn btn-primary" onClick={(e) => {
                                                if (window.confirm('are you sure?')) {
                                                    actionRequest(e, request.id, 'Approving');
                                                }
                                            }} disabled={request.statusrequest === 'Approved' || request.statusrequest === 'Closed'
                                                || request.statusrequest === 'Completed' ? true : false}><i className="bi bi-check-circle"></i></button>
                                        </span>

                                        <HoverMessage id={index + 'decline'} message={message} />
                                        <span style={{marginLeft:"5px"}} onMouseOut={() => { hoverOut(index + 'decline') }} onMouseOver={() => {
                                            hoverDisabledButton(index + 'decline', request.statusrequest,
                                                request.statusrequest === 'Declined' || request.statusrequest === 'Closed' || request.statusrequest === 'Completed' ? true : false)
                                        }}>
                                            <button className="btn btn-danger" onClick={(e) => {
                                                if (window.confirm('are you sure?')) {
                                                    actionRequest(e, request.id, 'Declining');
                                                }
                                            }} disabled={request.statusrequest === 'Declined' || request.statusrequest === 'Closed'
                                                || request.statusrequest === 'Completed' ? true : false}><i className="bi bi-bag-x"></i></button>
                                        </span>

                                    </>
                                }
                                {String(request.idrequester) === String(userid) &&
                                    <>
                                        <HoverMessage id={index + 'return'} message={message} />
                                        <span style={{marginLeft:"5px"}} onMouseOut={() => { hoverOut(index + 'return') }} onMouseOver={() => {
                                            hoverDisabledButton(index + 'return', 'Return', request.statusrequest !== 'Approved' || request.isreturnsent === 1 ? true : false)
                                        }}>
                                            <button id='returnbutton' className="btn btn-primary" disabled={request.statusrequest !== 'Approved' || request.isreturnsent === 1 ? true : false}
                                                onClick={(e) => {
                                                    if (window.confirm('are you sure?')) {
                                                        returnItem(e, request.id);
                                                    }
                                                }}><i className="bi bi-arrow-left-right"></i></button>
                                        </span>

                                    </>
                                }
                            </td>
                        </tr>
                    )
                })
                }
            </tbody>

        </table>
    );
}

export default RequestsList;