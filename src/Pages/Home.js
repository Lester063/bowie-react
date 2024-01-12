import { useState } from "react";
import BodyTemplate from "../components/BodyTemplate";
import Loading from '../components/Loading';
import useLoading from "../components/useLoading";

import itempage from './../images/items.png';
import itemsmanage from './../images/itemsmanage.png';
import requestpage from './../images/request.png';
import requestmanage from './../images/requestmanage.png';
import returnpage from './../images/returnpage.png';
import returnmanage from './../images/returnmanage.png';
import communication from './../images/communication.png';

const Home = () => {
    document.title = 'Home';
    const { loading } = useLoading();
    const [imageSrc, setImageSrc] = useState(null);
    const data = {
        body: `Bowie is a web application that can be used as something like a management tool
        for the Organisation to let their member to request or borrow any item they 
        need to perform a task.`
    }

    const features = [
        {
            featurename: 'View Items',
            description: 'Items are displayed and buttons are enabled for the items available for the User.',
            image: itempage
        },
        {
            featurename: 'Manage Items',
            description: 'Admin has the ability to add, update, and delete items.',
            image: itemsmanage
        },
        {
            featurename: 'View Requests',
            description: 'Admin can view all the request from the users, there is also a separate pages to view their own.',
            image: requestpage
        },
        {
            featurename: 'Manage Requests',
            description: 'Admin can either approve or decline a request.',
            image: requestmanage
        },
        {
            featurename: 'View Returns',
            description: 'Admin can view the return items from the User.',
            image: returnpage
        },
        {
            featurename: 'Manage Returns',
            description: 'Admin can approve the return request of the User.',
            image: returnmanage
        },
        {
            featurename: 'Communication per item request',
            description: 'Admin and User has a way to communicate to each other per request, this makes the processed smooth on each side.',
            image: communication
        },
    ]

    const displayFeatureData = async (index) => {
        var x = document.getElementById('feature');
        x.innerHTML=features[index].description;
        setImageSrc(features[index].image);
        
    }
    const hoverList = async (id) => {
        document.getElementById(id).style.cursor='pointer';
    }

    const unHoverList = async (id) => {
        document.getElementById(id).style.cursor='none';
    }

    return (
        <div className="mobile-body">
            {loading &&
                <Loading />
            }

            {!loading &&
                <BodyTemplate title="Home" body={data} />
            }
            <div className="container mt-3">
                <div className="row">
                    <div className='col-4'>
                        <h3>Features: </h3>
                        <ul>
                        {   
                            features.map((feature, index)=>{
                                return (
                                    <li key={index} id={index+'list'}
                                    onClick={() => {displayFeatureData(index)}}
                                    onMouseOver={() => {hoverList(index+'list')}}
                                    onMouseOut={() => {unHoverList(index+'list')}}
                                    >{feature.featurename}</li>
                                )
                            })
                        }
                        </ul>

                    </div>
                    <div className='col-8'>
                        {imageSrc && 
                            <img src={imageSrc} alt="ReactLogs" style={{width:'100%'}}/>
                        }
                        <p id='feature'></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;