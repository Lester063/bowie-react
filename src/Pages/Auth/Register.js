import Loading from '../../components/Loading.js';
import { useState, useEffect } from 'react';
import axios from 'axios';
const Register = () => {
    document.title = 'Register';
    const [loading, setLoading] = useState(false);
    const [inputError, setInputError] = useState({});

    const [user, setUser] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 200);
    }, [])

    //input changes
    const handleChange = (e) => {
        e.preventDefault();
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const saveUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            first_name: user.first_name,
            middle_name: user.middle_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password
        }

        try {
            const response = await axios.post(`http://localhost:8000/api/register`, data);
            setLoading(false);
            alert(response.data.message);
            setUser({
                first_name: "",
                middle_name: "",
                last_name: "",
                email: "",
                password: ""
            })
            setInputError({});
        }
        catch(error) {
            if (error.response) {
                if (error.response.status === 422) {
                    setLoading(false);
                    setInputError(error.response.data.errors);
                }
                else if (error.response.status === 500) {
                    setLoading(false);
                    setInputError(error.response.data.message);
                }
            }
        }
    }

    return (
        <div className="mobile-body">
            {loading && <Loading />}
            {!loading &&
                <div className="row">
                    <div className={window.innerWidth < 700 ? "col-11 mt-3 mx-auto" : "col-3 mt-3 mx-auto"}>
                    <form onSubmit={saveUser}>
                        <h1>Create account</h1>
                        <input type="text" placeholder="First name" className="form-control mt-1" value={user.first_name} name="first_name" onChange={handleChange} />
                        <span className="text-danger">{inputError.first_name}</span>
                        <input type="text" placeholder="Middle name" className="form-control mt-1" value={user.middle_name} name="middle_name" onChange={handleChange} />
                        <span className="text-danger">{inputError.middle_name}</span>
                        <input type="text" placeholder="Last name" className="form-control mt-1" value={user.last_name} name="last_name" onChange={handleChange} />
                        <span className="text-danger">{inputError.last_name}</span>
                        <input type="email" placeholder="Email" className="form-control mt-1" value={user.email} name="email" onChange={handleChange} />
                        <span className="text-danger">{inputError.email}</span>
                        <input type="password" placeholder="Password" className="form-control mt-1" value={user.password} name="password" onChange={handleChange} />
                        <span className="text-danger">{inputError.password}</span>
                        <button className="w-100 btn btn-lg btn-primary mt-2">Register</button>
                    </form>
                    </div>
                </div>
            }
        </div>
    );
}

export default Register;