import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../../components/Loading';
import StudentList from './StudentList';
import useFetch from '../../components/useFetch';

const Student = () => {
    const [students, setStudent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isClicked, setClicked] = useState(false);

    const is_admin = localStorage.getItem('is_admin');

    const data = useFetch(`http://localhost:8000/api/students`, isClicked);
    useEffect(() => {
        document.title = 'Students';
        if (data && data !== null) {
            setStudent(data);
            setLoading(false);
            setClicked(false);
            console.log(data);
        }
    }, [isClicked, data]);

    const handleDelete = (e, id) => {
        e.preventDefault();
        axios.delete(`http://localhost:8000/api/students/${id}/delete`, { withCredentials: true }).then(res => {
            alert(res.data.message);
            setClicked(true);
        })
    }

    let menu;
    if (is_admin === '1') {
        menu = (
            <>
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
            </>
        )
    } else {
        menu = (
            <p>Forbidden</p>
        )
    }

    return (
        <>
            {menu}
        </>
    );
}

export default Student;