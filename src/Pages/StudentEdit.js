import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';

const StudentEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [student, setStudent] = useState({
        name:"",
        email:"",
        course:"",
        phone:""
    });
    const [loading, setLoading] = useState(false);
    const [inputError, setInputError] = useState({});

    //input changes
    const handleChange = (e) => {
        e.preventDefault();
        setStudent({...student, [e.target.name]: e.target.value});
    }

    useEffect(()=>{
        axios.get(`http://localhost:8000/api/students/${id}/edit`).then(res=>{
            setStudent(res.data.data);
            setLoading(false);
        })
    },[id])

    const saveNewStudentData = (e) =>{
        e.preventDefault();
        axios.put(`http://localhost:8000/api/students/${id}/edit`, student).then(res=>{
            setLoading(false);
            alert('Data have been updated successfully.');
            navigate('/students');
        }).catch(function (error){
            if(error.response) {
                if(error.response.status === 422) {
                    setLoading(false);
                    setInputError(error.response.data.errors);
                    console.log(inputError)
                }
                //add 404 page
            }
        })
    }

    return (
        <form onSubmit={saveNewStudentData}>
            <div className="container mt-3">
                {loading && <Loading />}
                {
                    !loading &&
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4>
                                        <Link to="/students" className="btn btn-secondary float-end">Back</Link>
                                        Edit Student
                                    </h4>
                                </div>
                                <div className="card-body">
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
                                        <input type="text" name="phone" value={student.phone} onChange={handleChange} className="form-control" />
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

export default StudentEdit;