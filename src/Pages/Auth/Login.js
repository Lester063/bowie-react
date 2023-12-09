import Loading from '../../components/Loading.js';
import useLoading from "../../components/useLoading.js";
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    document.title = 'Login';
    const navigate = useNavigate();
    const { loading } = useLoading();
    const [ clickLoading, setLoading] = useState(false);
    const [inputError, setInputError] = useState();

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
            if (res.data.statuscode === 200) {
                setCredentials({
                    email:"",
                    password:""
                });
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('is_admin', res.data.is_admin);
                navigate('/');
            }
            else if (res.data.statuscode === 422) {
                setInputError(res.data.message);
            }
            else {
                setInputError('There might be a problem, please come back later.');
            }
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
                    <span className="text-danger">{inputError}</span>
                    <button className="w-100 btn btn-lg btn-primary">Login</button>
                </form>
            }
        </div>
    );
}

export default Login;