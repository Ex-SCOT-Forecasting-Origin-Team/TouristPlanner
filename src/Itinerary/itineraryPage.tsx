import React from 'react';
import ReactDOM from 'react-dom/client';
import '../css/index.css';
import reportWebVitals from '../reportWebVitals';
import GoogleMapSearchBar from '../GoogleMapSearchBar';
import MainPageGoogleMap from '../MainPageGoogleMap';
import UserExtraInputOptions from '../UserExtraInputOptions';
import HomeButton from '../homeButton';

function ItineraryPage(){
    return(
        <div>
            <HomeButton></HomeButton>
            <React.StrictMode>
                <MainPageGoogleMap></MainPageGoogleMap>
            </React.StrictMode>
        </div>
        
    );
}

export default ItineraryPage;