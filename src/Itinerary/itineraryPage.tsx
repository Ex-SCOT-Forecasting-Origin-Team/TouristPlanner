import React from 'react';
import ReactDOM from 'react-dom/client';
import '../css/index.css';
import reportWebVitals from '../reportWebVitals';
import GoogleMapSearchBar from '../GoogleMapSearchBar';
import MainPageGoogleMap from '../MainPageGoogleMap';
import UserExtraInputOptions from '../UserExtraInputOptions';
import HomeButton from '../homeButton';
import data  from './fakeData.json';
import { DayPlan } from '../searchGeneration';
import autoGoogleSearch from '../autoGoogleSearch';

function ItineraryPage(){
  const itinerary = {
        "day": [{
            "places": [{
                "origin": {
                    "name": "The Spheres",
                    "lat": 47.6159,
                    "lng": 122.3394
                },
                "commute": {
                    "visitTime": 11,
                    "leaveTime": 12.5,
                    "commmuteMethod": "Car"
                },
                "destination": {
                    "name": "Space Needle",
                    "lat": 47.6205,
                    "lng": 122.3493,
                    "destinationOpen": 10,
                    "destinationClosed": 19
                }
            },
            {
                "origin": {
                    "name": "Space Needle",
                    "lat": 47.6205,
                    "lng": 122.3493
                },
                "commute": {
                    "visitTime": 12.5,
                    "leaveTime": 14,
                    "commmuteMethod": "Car"
                },
                "destination": {
                    "name": "Volunteer Park",
                    "lat": 47.6311,
                    "lng": 122.3164,
                    "destinationOpen": 10,
                    "destinationClosed": 19
                }
            }]
        },
      ]
  }
  
  const numDays = Object.keys(itinerary.day).length;
  
  //This errors for now so leaving it commented
  // for(let i = 0; i < numDays; i++){
  //   const numPlaces = Object.keys(itinerary.day[i].places).length;
  //   for(let j = 0; i < numPlaces; j++){
  //     console.log("Searching destination");
  //     autoGoogleSearch(itinerary.day[i].places[j].origin.name, itinerary.day[i].places[j].destination.name, "tourist_attraction");
  //   }
  // }

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