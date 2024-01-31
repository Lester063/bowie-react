import { useEffect, useState } from "react";
import axios from 'axios';
import useLoading from "../../components/useLoading";
import Loading from "../../components/Loading";
import ForbiddenPage from "../../components/ForbiddenPage";

const Profile = () => {
    document.title = 'Profile';
    const { loading } = useLoading();
    const [userData, setUserData] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const userid = localStorage.getItem('userid');
    async function getUser() {
        try {
            if(userid !== null) {
                const response = await axios.get('http://localhost:8000/api/user', { withCredentials: true });
                setUserData(response.data);
                getProfile(response.data)
            }
        }
        catch(error) {
            console.log('error:');
        }
    }

    async function getProfile(datas) {
        try {
            datas.profile_image !== null ?
            setProfileImage(`http://localhost:8000/storage/${datas.profile_image}`)
            :
            setProfileImage(null);
        }
        catch(error) {
            console.log('error: ');
            console.log(error);
        }
    }

    useEffect(()=>{
        getUser();
    },[]);

    let menu;
    {userid === null ?
        menu = (
            <ForbiddenPage/>
        ) 
        :
        menu = (
            <>
            {loading &&
                <Loading />
            }
            {!loading && userData && 
            <div className="container">
            <div className="row">
                <div className="col md-12">
                    <div className="card mt-3">
                        <div className="card-header">
                            <h1>Personal Information</h1>
                        </div>
                        <div className="card-body">
                            <table className="table table-striped">
                                <tbody>
                                    <tr>
                                        <td style={{width: "200px"}}>Profile Picture: </td>
                                        <td>{profileImage !== null ? <img src={profileImage} style={{width:"250px"}}/> : <>Please upload your profile picture.</>}</td>
                                    </tr>
                                    <tr>
                                        <td style={{width: "200px"}}>First Name: </td>
                                        <td>{userData.name}</td>
                                    </tr>
                                    <tr>
                                        <td style={{width: "200px"}}>Middle Name: </td>
                                        <td>Middle Name</td>
                                    </tr>
                                    <tr>
                                        <td style={{width: "200px"}}>Last Name: </td>
                                        <td>Last Name</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            }
            </>
        )
    }
    return (
        <div className="mobile-body">
            {menu}
            
        </div>
    );
}

export default Profile;