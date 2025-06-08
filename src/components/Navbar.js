import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotificationContainer from './NotificationContainer.js';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001');

const Navbar = () => {
    const navigate = useNavigate();
    const isAdmin = localStorage.getItem('isAdmin');
    const firstName = localStorage.getItem('firstName');
    const userid = localStorage.getItem('userid');

    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            //no need to pass data, I am just having a 401 issue when not passing any data, looks like a bug.
            const response = await axios.post(`http://localhost:8000/api/logout`, 'passingdata', { withCredentials: true });
            if (response.data.message === 'Success') {
                localStorage.removeItem('isAdmin');
                localStorage.removeItem('firstName');
                localStorage.removeItem('userid');
                navigate('/login');
            }
        }
        catch (error) {
            console.log('error: ' + error);
        }
    }

    const toggleNotification = async (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
        try {
            if(!isOpen) {
                await getNotification()
                await axios.put(`http://localhost:8000/api/notifications`, 'data', { withCredentials: true });
                setUnreadNotificationCount(0);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    async function getNotification() {
        try {
            const response = await axios.get(`http://localhost:8000/api/notifications`, { withCredentials: true });
            setNotifications(response.data.data);
            setUnreadNotificationCount(response.data.unreadnotification);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        socket.on("sendNotificationToClient", ([notification]) => {
            setNotifications((state) =>
                String(notification.recipientUserId) === String(userid) ?
                    [
                        {
                            recipientUserId: notification.recipientUserId,
                            senderUserId: notification.senderUserId,
                            type: notification.type,
                            isRead: notification.isRead,
                            typeValueId: notification.typeValueId,
                            updated_at: notification.updated_at,
                            created_at: notification.created_at,
                            id: notification.id,
                            notificationMessage: notification.notificationMessage
                        },
                        ...state
                    ]
                    :
                    [
                        ...state
                    ]
            );

            setUnreadNotificationCount(String(notification.recipientUserId) === String(userid) ? unreadNotificationCount + 1 : unreadNotificationCount);
        });

        return () => socket.off('sendNotificationToClient');
    }, [socket, unreadNotificationCount]);

    useEffect(() => {
        if (userid !== null) {
            getNotification();
        }
    }, [userid]);

    // useEffect(() => {
    //     // Clear token when the user closes the browser
    //     const handleBeforeUnload = () => {
    //       localStorage.removeItem('isAdmin');
    //       localStorage.removeItem('userid');
    //       localStorage.removeItem('firstName');
    //     };
      
    //     window.addEventListener('beforeunload', handleBeforeUnload);
    //     return () => {
    //       window.removeEventListener('beforeunload', handleBeforeUnload);
    //     };
    //   }, []);

    let menu;
    if (isAdmin === null || isAdmin === '') {
        menu = (
            <div className="container">
                <Link className="navbar-brand" to="/">Bowie</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">About us</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">Contact us</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/register">Register</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Login</Link>
                        </li>
                    </ul>
                </div>
            </div>
        )
    } else if (isAdmin !== null || isAdmin !== '') {
        menu = (
            <div className="container">
                <Link className="navbar-brand" to="/">{firstName}</Link>
                {window.innerWidth < 700 &&
                    <Link to="/notifications" style={{margin:"0 auto", marginRight:"10px"}} onClick={()=>setUnreadNotificationCount(0)}>
                        {
                            unreadNotificationCount > 0 &&
                            <b style={{
                                position: "absolute",
                                zIndex: "1",
                                backgroundColor: "red",
                                color: "#fff",
                                marginTop: "-10px",
                                marginLeft: "10px",
                                width: "18px",
                                height: "18px",
                                fontSize: "11px",
                                borderRadius: "100%",
                                textAlign:"center"
                            }}>{unreadNotificationCount}</b>
                        }
                        <i className="bi bi-bell"></i>
                    </Link>
                }
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/items">Items</Link>
                        </li>
                        {isAdmin === '1' &&
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/requests">Users Request</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/returns">Users Return</Link>
                                </li>
                            </>
                        }
                        <li className="nav-item">
                            <Link className="nav-link" to="/myrequests">My Requests</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/myreturns">My Returns</Link>
                        </li>
                        {window.innerWidth > 700 &&
                            <li className="nav-item">
                                <button className="nav-link" onClick={(e) => { toggleNotification(e) }}>
                                    {
                                        unreadNotificationCount > 0 &&
                                        <b style={{
                                            position: "absolute",
                                            zIndex: "1",
                                            backgroundColor: "red",
                                            color: "#fff",
                                            marginTop: "-10px",
                                            marginLeft: "10px",
                                            width: "18px",
                                            height: "18px",
                                            fontSize: "11px",
                                            borderRadius: "100%",
                                            textAlign:"center"
                                        }}>{unreadNotificationCount}</b>
                                    }
                                    <i className="bi bi-bell"></i>
                                </button>
                            </li>
                        }
                        <li className="nav-item">
                            <button className="nav-link" onClick={handleLogout}>Logout</button>
                            {window.innerWidth > 700 &&
                                <NotificationContainer isOpen={isOpen} notifications={notifications} />
                            }
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary shadow" id="navcontainer">
                {menu}
        </nav>
    );
}

export default Navbar;