import { Route, Routes } from 'react-router-dom';
import Home from "../Pages/Home";
import Contact from "../Pages/Contact";
import About from "../Pages/About";
import Students from "../Pages/Students/Students";
import StudentCreate from '../Pages/Students/StudentCreate';
import StudentEdit from '../Pages/Students/StudentEdit';
import Register from '../Pages/Auth/Register';
import Login from '../Pages/Auth/Login';
import NotFound from '../Pages/NotFound';
import Navbar from "../components/Navbar";
import Items from "../Pages/Item/Items";
import ItemCreate from "../Pages/Item/ItemCreate";
import ItemEdit from "../Pages/Item/ItemEdit";
import MyRequests from "../Pages/Request/MyRequest";
import UsersRequest from "../Pages/Request/UsersRequest";
import RequestCommunication from "../Pages/RequestCommunication/RequestCommunication";


function MyRouter() {

    return (
        <>
        <Routes>
            {/* outside */}
            <Route path="/" element={<><Navbar /> <Home/></>} />
            <Route path="/contact" element={<><Navbar /> <Contact/></>} />
            <Route path="/about" element={<><Navbar /> <About/></>} />
            <Route path="/register" element={<><Navbar /> <Register/></>}/>
            <Route path="/login" element={<><Navbar /> <Login/></>}/>
            {/* logged in -admin*/}
            <Route path="/students" element={<><Navbar /> <Students/></>} />
            <Route path="/student/create" element={<><Navbar /> <StudentCreate/></>} />
            <Route path="/students/:id/edit" element={<><Navbar /> <StudentEdit/></>} />

            <Route path="/items" element={<><Navbar /> <Items/></>} />
            <Route path="/item/create" element={<><Navbar /> <ItemCreate/></>} />
            <Route path="/items/:id/edit" element={<><Navbar /> <ItemEdit/></>} />

            {/*request */}
            <Route path="/myrequests" element={<><Navbar /> <MyRequests/></>} />
            <Route path="/requests" element={<><Navbar /> <UsersRequest/></>} />

            {/*request communication */}
            <Route path="/requestcommunication/:id" element={<><Navbar /> <RequestCommunication/></>} />

            <Route path="*" element={<NotFound />}/>
        </Routes>
        </>
    )
}

export default MyRouter;