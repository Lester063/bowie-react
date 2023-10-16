import { Link } from 'react-router-dom';
const StudentList = ({students, handleDelete}) => {
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>List#</th>
                    <th>Name</th>
                    <th>Course</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th colSpan="2">Action</th>
                </tr>
            </thead>
            <tbody>
                {students && students.map((student, index) => {
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{student.name}</td>
                            <td>{student.course}</td>
                            <td>{student.email}</td>
                            <td>{student.phone}</td>
                            <td style={{width:"220px"}}>
                                <Link to={`/students/${student.id}/edit`} className="btn btn-primary">Edit</Link>
                                <button className="btn btn-danger" style={{marginLeft:"5px"}} onClick={(e) => {
                                    if (window.confirm('are you sure?')) {
                                        handleDelete(e, student.id);
                                    }
                                }}>Delete</button>
                            </td>
                        </tr>
                    )
                })
                }
            </tbody>

        </table>
    );
}

export default StudentList;