import { Route, Routes } from 'react-router-dom';
import Home from "../Pages/Home";
import Contact from "../Pages/Contact";
import About from "../Pages/About";
import Students from "../Pages/Students";
import StudentCreate from '../Pages/StudentCreate';
import StudentEdit from '../Pages/StudentEdit';
import Register from '../Pages/Register';
import Login from '../Pages/Login';
import NotFound from '../Pages/NotFound';
function MyRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/students" element={<Students />} />
            <Route path="/student/create" element={<StudentCreate />} />
            <Route path="/students/:id/edit" element={<StudentEdit />} />
            <Route path="/register" element={<Register />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="*" element={<NotFound />} />

        </Routes>
    )
}

export default MyRouter;