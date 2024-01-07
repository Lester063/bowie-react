import NotificationList from '../Pages/Notification/NotificationList';
const NotificationContainer = ({isOpen, notifications}) => {

    return (
        <div id='scrollbar' style={{
            width: "300px",
            height:"500px",
            maxHeight: "500px",
            padding:"10px",
            overflowY: "scroll",
            border: "1px solid #8c8c8c",
            position: "absolute",
            zIndex: "1",
            marginLeft: "-240px",
            marginTop:"8px",
            backgroundColor: "#8c8c8c",
            display: isOpen === true ? "block" : "none"
        }}>
            <NotificationList notifications={notifications}/>
        </div>
    );
}

export default NotificationContainer;