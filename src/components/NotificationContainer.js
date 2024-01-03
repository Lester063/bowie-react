const NotificationContainer = ({isOpen, notifications, notificationMessage}) => {

    return (
        <div style={{
            width: "300px",
            height:"500px",
            maxHeight: "500px",
            padding:"10px",
            overflowY: "scroll",
            border: "1px solid #8c8c8c",
            position: "absolute",
            zIndex: "1",
            marginLeft: "-240px",
            backgroundColor: "#8c8c8c",
            display: isOpen === true ? "block" : "none"
        }}>
            <h5>Notification</h5>
            {notifications.map((notification, index) => {

                let path='#';
                switch(notification.type) {
                    case 'approve the request': path = '/myrequests'; break;
                    case 'approve the return': path = '/myreturns'; break;
                    default: path = '#';
                }

                let message;

                notificationMessage?.map((notifmessage) => {
                    if (notifmessage.notificationID === notification.id) {
                        message = notifmessage.notificationMessage;
                    }
                    return message;
                })

                return (
                    <div key={index} style={{
                        width: "100%",
                        height: "70px",
                        borderTop: "1px solid #adaaaa",
                    }}>
                        <a href={path}
                        style={{
                            textDecoration:"none",
                            color:"#000"
                        }}>{message}</a>
                    </div>
                )
            })}

            {notifications.length < 1 && <p>No notifications.</p>}

        </div>
    );
}

export default NotificationContainer;