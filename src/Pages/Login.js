import Loading from '../components/Loading.js';
import useLoading from "../components/useLoading";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const navigate = useNavigate();
    const { loading } = useLoading();
    const [ clickLoading, setLoading] = useState(false);

    const [ cred, setCredentials ] = useState({
        email:"",
        password:""
    });

    const handleChange = (e) => {
        e.preventDefault();
        setCredentials({...cred, [e.target.name]: e.target.value});
    }

    const login = (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            email: cred.email,
            password: cred.password
        }
        axios.post(`http://localhost:8000/api/login`, data,{withCredentials:true}).then(res => {
            setLoading(false);
            setCredentials({
                email:"",
                password:""
            });
            localStorage.setItem('token', res.data.token);
            navigate('/');
        })
    }

    return (
        <div>
            {(clickLoading || loading) && <Loading />}
            {!clickLoading && !loading &&
                <form onSubmit={login}>
                    <h1>Please login</h1>
                    <input type="email" placeholder="Email" className="form-control" value={cred.email} name="email" onChange={handleChange}/>
                    <input type="password" placeholder="Password" className="form-control" value={cred.password} name="password" onChange={handleChange} />
                    <button className="w-100 btn btn-lg btn-primary">Login</button>
                </form>
            }
        </div>
    );
}

export default Login;