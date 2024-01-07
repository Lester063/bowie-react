import { useEffect, useState } from 'react';
import axios from 'axios';
import NotificationList from './NotificationList';
const NotificationPage = () => {
    const userid = localStorage.getItem('userid');
    const [notifications, setNotifications] = useState([]);

    async function getNotification() {
        try {
            const response = await axios.get(`http://localhost:8000/api/notifications`, { withCredentials: true });
            await axios.put(`http://localhost:8000/api/notifications`, 'data', { withCredentials: true });
            setNotifications(response.data.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (userid !== '') {
            getNotification();
        }
    }, [userid]);
    return (
        <div style={{padding:"10px"}}>
            <NotificationList notifications={notifications}/>
        </div>
    );
}

export default NotificationPage;