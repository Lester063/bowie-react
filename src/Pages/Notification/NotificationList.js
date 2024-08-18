const NotificationList = ({ notifications }) => {
    return (
        <>
            <h5>Notification</h5>
            {notifications.map((notification, index) => {

                let path = '#';
                switch (notification.type) {
                    case 'approve the request': path = `/requests/${notification.typeValueId}`; break;
                    case 'decline the request': path = `/requests/${notification.typeValueId}`; break;
                    case 'close the request': path = `/requests/${notification.typeValueId}`; break;
                    case 'approve the return': path = `/return/${notification.typeValueId}`; break;
                    case 'sent a message': path = `/requestcommunication/${notification.typeValueId}`; break;
                    case 'requesting the item': path = `/requests/${notification.typeValueId}`; break;
                    case 'returning the item': path = `/return/${notification.typeValueId}`; break;
                    default: path = '#';
                }

                return (
                    <div key={index} style={{
                        width: "100%",
                        minHeight: "40px",
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