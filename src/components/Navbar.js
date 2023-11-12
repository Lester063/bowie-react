import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const [userData, setUserdata] = useState({
        name: "",
        is_admin: ""
    });
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = async (e) => {
        e.preventDefault();
        localStorage.setItem('token', '');
        //no need to pass token, I am just having a 401 issue when not passing any data, looks like a bug.
        await axios.post(`http://localhost:8000/api/logout`, token,
            {
                withCredentials: true
            }).then(res => {
                setUserdata({
                    name: "",
                    is_admin: ""
                });
                navigate('/login');
            })
    }

    useEffect(() => {
        if (token) {
            axios.get(`http://localhost:8000/api/user`,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }).then(res => {
                    const content = res.data;
                    console.log(content.name);
                    setUserdata({
                        name: content.name,
                        is_admin: content.is_admin
                    });
                });
        }
    }, [token]);

    let menu;
    if (token == '') {
        menu = (
            <>
                <Link className="navbar-brand" to="/">Student</Link>
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
            </>
        )
    } else {
        menu = (
            <>
                <Link className="navbar-brand" to="/">{userData.name}</Link>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        {userData.is_admin == 1 &&
                            <li className="nav-item">
                                <Link className="nav-link" to="/students">Students</Link>
                            </li>
                        }
                        <li className="nav-item">
                            <button className="nav-link" onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                </div>
            </>
        )
    }
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary shadow">
            <div className="container">
                {menu}
            </div>
        </nav>
    );
}

export default Navbar;