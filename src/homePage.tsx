import React from 'react';
import ReactDOM from 'react-dom/client';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './css/index.css';
import reportWebVitals from './reportWebVitals';
import GoogleMapSearchBar from './GoogleMapSearchBar';
import MainPageGoogleMap from './MainPageGoogleMap';
import UserExtraInputOptions from './UserExtraInputOptions';

function HomePage(){
    const navigate = useNavigate();
    const navigateToPage = () => {  
        navigate({
        pathname: "/Itinerary"
        });
    };;

    const [searchParams] = useSearchParams();
    
    return(
        <React.StrictMode>
            <GoogleMapSearchBar></GoogleMapSearchBar> 
            <MainPageGoogleMap></MainPageGoogleMap>
            <UserExtraInputOptions></UserExtraInputOptions>
            <button onClick={() => navigateToPage()}>
                View Itnerary
            </button>
        </React.StrictMode>
    );
}

export default HomePage;