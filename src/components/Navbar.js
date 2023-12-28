import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

const Navbar = () => {
    const navigate = useNavigate();
    const is_admin = localStorage.getItem('is_admin');
    const name = localStorage.getItem('name');

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            //no need to pass token, I am just having a 401 issue when not passing any data, looks like a bug.
            const response = await axios.post(`http://localhost:8000/api/logout`, 'passingdata', { withCredentials: true });
            if (response.data.message === 'Success') {
                localStorage.setItem('is_admin', '');
                localStorage.setItem('userid', '');
                localStorage.setItem('name', '');
                navigate('/login');
            }
        }
        catch(error){
            console.log('error: '+error);
        }
    }

    useEffect(()=>{
        console.log(is_admin)
        console.log(name)
    },[])

    let menu;
    if (is_admin === null || is_admin ==='') {
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
    } else if (is_admin !== null || is_admin !=='') {
        menu = (
            <>
                <Link className="navbar-brand" to="/">{name}</Link>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        {is_admin === '1' &&
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
                            <Link className="nav-link" to="/items">Item</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/myrequests">My Requests</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/myreturns">My Returns</Link>
                        </li>
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