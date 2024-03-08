import Loading from '../../components/Loading.js';
import useLoading from "../../components/useLoading.js";
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    document.title = 'Login';
    const navigate = useNavigate();
    const { loading } = useLoading();
    const [clickLoading, setLoading] = useState(false);
    const [inputError, setInputError] = useState();

    const [cred, setCredentials] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        e.preventDefault();
        setCredentials({ ...cred, [e.target.name]: e.target.value });
    }

    const login = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            email: cred.email,
            password: cred.password
        }
        setCredentials({
            email: "",
            password: ""
        });
        try {
            const response = await axios.post(`http://localhost:8000/api/login`, data, { withCredentials: true });
            setLoading(false);
            if (response.data.statuscode === 200) {
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
        catch (error) {
            console.log('error: ' + error);
        }
    }

    return (
        <div className="mobile-body">
            {(clickLoading || loading) && <Loading />}
            {!clickLoading && !loading &&
                <div class="row">
                    <div className={window.innerWidth < 700 ? "col-11 mt-3 mx-auto" : "col-3 mt-3 mx-auto"}>
                        <form onSubmit={login}>
                            <h1>Please login</h1>
                            <input type="email" placeholder="Email" className="form-control mt-1" value={cred.email} name="email" onChange={handleChange} />
                            <input type="password" placeholder="Password" className="form-control mt-1" value={cred.password} name="password" onChange={handleChange} />
                            <span className="text-danger">{inputError}</span>
                            <button className="w-100 btn btn-lg btn-primary mt-2">Login</button>
                        </form>
                    </div>
                </div>
            }
        </div>
    );
}

export default Login;