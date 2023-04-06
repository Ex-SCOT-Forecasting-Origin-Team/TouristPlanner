import React, { useEffect, useState, useRef } from 'react';
import '../css/index.css';
import MainPageGoogleMap from '../MainPageGoogleMap';
import HomeButton from '../homeButton';
import { Day } from './day';
import { GoogleMap, useJsApiLoader , useLoadScript, MarkerF, InfoWindow, } from "@react-google-maps/api";
import axios from 'axios';
import itinerary from './fakeData.json'
import '../css/Itinerary.css'
// import './css/GoogleMapEntity.css'

interface itinerary {
    day: [];
    place: [];
    origin: string;
    commute: string;
    destination: string;
}

function ItineraryPage(){
    const [day, setDay] = useState(new Day(itinerary.day.length));

    const previousDayButton = useRef<HTMLButtonElement>(null);
    const nextDayButton = useRef<HTMLButtonElement>(null);

    var stepDisplay: google.maps.InfoWindow;

    useEffect(() => {
        console.log("Starting onLoad")
        setDay(new Day(itinerary.day.length))
        console.log(day.day)
        console.log("Finished onLoad")
    }, []);

    function getTravelMethod(itinerary: { day: { places: { origin: { name: string; lat: number; lng: number; }; commute: { visitTime: number; leaveTime: number; commmuteMethod: string; }; destination: { name: string; lat: number; lng: number;}; }[]; }[]; ""?: any; }, currDay: number) {
        if (itinerary.day[currDay].places[0].commute.commmuteMethod == "DRIVING")            
            return google.maps.TravelMode.DRIVING
        else if (itinerary.day[currDay].places[0].commute.commmuteMethod == "WALKING")            
            return google.maps.TravelMode.WALKING
        else if (itinerary.day[currDay].places[0].commute.commmuteMethod == "BUS" || 
            itinerary.day[currDay].places[0].commute.commmuteMethod == "TRAIN" || 
            itinerary.day[currDay].places[0].commute.commmuteMethod == "SUBWAY") 
                return google.maps.TravelMode.TRANSIT

        else return google.maps.TravelMode.WALKING
    }

    function handleClickNextDay() {
        console.log("Next Button Clicked")
        day.nextDay(); // call nextDay function to update day
    }

    function handleClickPreviousDay() {
        console.log("Previous Button Clicked")
        day.previousDay(); // call previousDay function to update day
        console.log("Day: " + day.day)
    }

    function initMap() {
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();
        var defaultLocation = new google.maps.LatLng(45.6720, 122.6681);
        const map = new window.google.maps.Map(document.getElementById("map") as HTMLElement, {
            zoom: 14,
            center: defaultLocation
        });

        directionsRenderer.setMap(map);

        const numPlaces = Object.keys(itinerary.day[day.day].places).length;

        const waypoints = []
        var start = itinerary.day[day.day].places[0].origin.name;
        var end = itinerary.day[day.day].places[numPlaces-1].destination.name;

        stepDisplay = new google.maps.InfoWindow();

        for(let currPlace = 0; currPlace < numPlaces -1; currPlace++){
            console.log("Searching destination");
            var stop = {
                location: itinerary.day[day.day].places[currPlace].destination.name,
                stopover: true
            }
            waypoints.push(stop)
        } 

        var request = {
            origin: start,
            destination: end,
            waypoints: waypoints,
            travelMode: getTravelMethod(itinerary, day.day), 
            unitSystem: google.maps.UnitSystem.METRIC
        };

        directionsService.route(request, function(response, status) {
        if (status == 'OK') {
            directionsRenderer.setDirections(response);
            if(response != null){
                const route = response.routes[0];
                const summaryPanel = document.getElementById(
                    "directions-panel"
                ) as HTMLElement;
                
                summaryPanel.innerHTML = "";

                // For each route, display summary information.
                for (let i = 0; i < route.legs.length; i++) {
                    const steps = route.legs[i].steps;
                    const routeSegment = i + 1;

                    summaryPanel.innerHTML +=
                    "<b>Route Segment: " + routeSegment + "</b><br>";
                    summaryPanel.innerHTML += route.legs[i].start_address + " to ";
                    summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
                    summaryPanel.innerHTML += route.legs[i].distance!.text + "<br><br>";
                    for(let step = 0; step < steps.length; step++){
                        summaryPanel.innerHTML += steps[step].instructions + "  ";
                        const distanceInMeters = steps[step].distance!.value;
                        const distanceInKilometers = distanceInMeters / 1000;
                        if(step != steps.length -1){
                            summaryPanel.innerHTML += distanceInKilometers + " miles"  + "<br><br>";
                        }else{
                            summaryPanel.innerHTML +="<br>";
                        }
                    }
                }
            }
            else{
                console.log("Error in Response")
            }
        }
        else{
            console.log("Error in Status")
        }
        });
    }

    return(
        <div>
            <HomeButton></HomeButton>
            <React.StrictMode>
            <button ref={nextDayButton} onClick={() => {
                handleClickNextDay();
                initMap();
                
            }}>
                Next Day
            </button>
            <button ref={previousDayButton} onClick={() => {
                handleClickPreviousDay();
                initMap();
            }}>
                    Previous Day
            </button>
            <div className="container">
                <div className='maps'> 
                    <MainPageGoogleMap></MainPageGoogleMap>
                </div>
                <div className="directions" id="directions-panel"></div>
            </div>
            </React.StrictMode>
        </div>

    );
}
export default ItineraryPage;