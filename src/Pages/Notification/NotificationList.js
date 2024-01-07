const NotificationList = ({notifications}) => {
    return (
        <>
            <h5>Notification</h5>
            {notifications.map((notification, index) => {

                let path = '#';
                switch (notification.type) {
                    case 'approve the request': path = '/myrequests'; break;
                    case 'approve the return': path = '/myreturns'; break;
                    case 'sent a message': path = `/requestcommunication/${notification.typeValueID}`; break;
                    case 'requesting the item': path = `/requests/${notification.typeValueID}`; break;
                    case 'returning the item': path = `/return/${notification.typeValueID}`; break;
                    default: path = '#';
                }

                return (
                    <div key={index} style={{
                        width: "100%",
                        height: "70px",
                        borderTop: "1px solid #adaaaa",
                    }}>
                        <a href={path}
                            style={{
                                textDecoration: "none",
                                color: "#000"
                            }}>{notification.notificationMessage}</a>
                    </div>
                )
            })}

            {notifications.length < 1 && <p>No notifications.</p>}
        </>
    );
}

export default NotificationList;