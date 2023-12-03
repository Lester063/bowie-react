import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import Loading from '../../components/Loading';

const StudentCreate = () => {
    const [inputError, setInputError] = useState({});
    const [loading, setLoading] = useState(false);

    const [student, setStudent] = useState({
        name:"",
        email:"",
        course:"",
        phone:""
    });

    //input changes
    const handleChange = (e) => {
        e.preventDefault();
        setStudent({...student, [e.target.name]: e.target.value});
    }

    //click save button
    const saveStudent = (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            name: student.name,
            email: student.email,
            course: student.course,
            phone: student.phone,
        }
        axios.post(`http://localhost:8000/api/students`, data,{withCredentials:true}).then(res=>{
            setLoading(false);
            alert(res.data.message);
            setStudent({
                name:"",
                email:"",
                course:"",
                phone:""
            });
            setInputError({});
        }).catch(function (error) {
            if(error.response) {
                if(error.response.status === 422) {
                    setLoading(false);
                    setInputError(error.response.data.errors);
                    console.log(inputError)
                }
                else if(error.response.status === 500) {
                    setLoading(false);
                    setInputError(error.response.data.message);
                    console.log(inputError)
                }
            }
        });
    }

    return (
        <form onSubmit={saveStudent}>
        <div className="container mt-3">
            {loading && <Loading />}
            {
                !loading && 
                <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <h4>
                                <Link to="/students" className="btn btn-secondary">Back</Link>
                                Create Student
                            </h4>
                        </div>
                        <div className="card-body">
                            <span className="text-danger">{inputError.message}</span>
                            <div className="mb-3">
                                <label>Name*</label>
                                <input type="text" name="name" value={student.name} onChange={handleChange} className="form-control" />
                                <span className="text-danger">{inputError.name}</span>
                            </div>
                            <div className="mb-3">
                                <label>Email*</label>
                                <input type="text" name="email" value={student.email} onChange={handleChange} className="form-control" />
                                <span className="text-danger">{inputError.email}</span>
                            </div>
                            <div className="mb-3">
                                <label>Course*</label>
                                <input type="text" name="course" value={student.course} onChange={handleChange} className="form-control" />
                                <span className="text-danger">{inputError.course}</span>
                            </div>
                            <div className="mb-3">
                                <label>Phone*</label>
                                <input type="text" name="phone" value={student.phone} onChange={handleChange}  className="form-control" />
                                <span className="text-danger">{inputError.phone}</span>
                            </div>
                            <button type="submit" className="btn btn-primary">Save</button>
                        </div>
                    </div>
                </div>
            </div>
            }
            </div>
        </form>
    );
}
 
export default StudentCreate;