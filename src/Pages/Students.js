import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../components/Loading';
import StudentList from './Students/StudentList';

const Student = () => {
    const [students, setStudent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isClicked, setClicked] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/students`).then(res => {
            setStudent(res.data.message);
            setLoading(false);
            setClicked(false);
        })
    }, [isClicked]);

    const handleDelete = (e, id) => {
        e.preventDefault();
        axios.delete(`http://localhost:8000/api/students/${id}/delete`).then(res => {
            alert(res.data.message);
            setClicked(true);
        })
    }

    return (
        <div className="container mt-3">
            {loading && <Loading />}
            {
                !loading &&
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4>Students List
                                    <Link to="/student/create" className="btn btn-primary float-end">Add Student</Link>
                                </h4>
                            </div>
                            <div className="card-body">
                                <StudentList students={students} handleDelete={handleDelete} />
                                {students.length < 1 && <p>No data to fetch.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default Student;