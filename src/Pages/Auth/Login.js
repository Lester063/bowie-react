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

    const login = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            email: cred.email,
            password: cred.password
        }
        setCredentials({
            email:"",
            password:""
        });
        try {
            const response = await axios.post(`http://localhost:8000/api/login`, data,{withCredentials:true});
            setLoading(false);
            if(response.data.statuscode === 200) {
                localStorage.setItem('is_admin', response.data.data.is_admin);
                localStorage.setItem('userid', response.data.data.id);
                localStorage.setItem('name', response.data.data.name);
                navigate('/');
            }
            else if (response.data.statuscode === 422) {
                setInputError(response.data.message);
            }
            else {
                setInputError('There might be a problem, please come back later.');
            }

        }
        catch(error) {
            console.log('error: '+error);
        }
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