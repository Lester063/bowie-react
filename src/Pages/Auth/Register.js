import Loading from '../../components/Loading.js';
import { useState, useEffect } from 'react';
import axios from 'axios';
const Register = () => {
    document.title = 'Register';
    const [loading, setLoading] = useState(false);
    const [inputError, setInputError] = useState({});

    const [user, setUser] = useState({
        name: "",
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

    const saveUser = (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            name: user.name,
            email: user.email,
            password: user.password
        }

        axios.post(`http://localhost:8000/api/register`, data).then(res => {
            setLoading(false);
            alert(res.data.message);
            setUser({
                name: "",
                email: "",
                password: ""
            })
            setInputError({});
        }).catch(function (error) {
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
        })
    }

    return (
        <div className="mobile-body">
            {loading && <Loading />}
            {!loading &&
                <div class="row">
                    <div className={window.innerWidth < 700 ? "col-11 mt-3 mx-auto" : "col-3 mt-3 mx-auto"}>
                    <form onSubmit={saveUser}>
                        <h1>Please register</h1>
                        <input type="text" placeholder="Name" className="form-control mt-1" value={user.name} name="name" onChange={handleChange} />
                        <span className="text-danger">{inputError.name}</span>
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