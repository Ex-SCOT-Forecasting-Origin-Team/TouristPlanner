import React, { useEffect, useState, useRef } from 'react';
import '../css/index.css';
import ItineraryPageGoogleMap from './itineraryPageGoogleMap';
import HomeButton from '../homeButton';
import { Day } from './day';
import { GoogleMap, useJsApiLoader , useLoadScript, MarkerF, InfoWindow, } from "@react-google-maps/api";
import axios from 'axios';
import { DirectionsRequest } from './directionsRequest';
import itinerary from './fakeData.json'
import '../css/Itinerary.css'
import { render } from '@testing-library/react';
import { resolve } from 'path';
// import './css/GoogleMapEntity.css'

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

    function getTravelMethod(itinerary: { day: { places: { origin: { name: string; lat: number; lng: number; }; commute: { visitTime: number; leaveTime: number; commmuteMethod: string; }; destination: { name: string; lat: number; lng: number;}; }[]; }[]; ""?: any; }, currDay: number, place: number) {
        if (itinerary.day[currDay].places[place].commute.commmuteMethod == "DRIVING")            
            return google.maps.TravelMode.DRIVING
        else if (itinerary.day[currDay].places[place].commute.commmuteMethod == "WALKING")            
            return google.maps.TravelMode.WALKING
        else if (itinerary.day[currDay].places[place].commute.commmuteMethod == "BUS" || 
            itinerary.day[currDay].places[place].commute.commmuteMethod == "TRAIN" || 
            itinerary.day[currDay].places[place].commute.commmuteMethod == "SUBWAY") 
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

    async function initMap() {
        const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer();
const renderers: google.maps.DirectionsRenderer[] = [];
const directions: google.maps.DirectionsResult[] = [];
const instructions: string[] = [];
let stepDisplay: google.maps.InfoWindow;


        // const directionsService = new google.maps.DirectionsService();
        // const directionsRenderer = new google.maps.DirectionsRenderer();
        var defaultLocation = new google.maps.LatLng(45.6720, 122.6681);
        const map = new window.google.maps.Map(document.getElementById("map") as HTMLElement, {
            zoom: 14,
            center: defaultLocation
        });

        // var renderers: google.maps.DirectionsRenderer[] = [];
        var requests: DirectionsRequest[] = []
        const numPlaces = Object.keys(itinerary.day[day.day].places).length;

        for(let currPlace = 0; currPlace < numPlaces; currPlace++){         
            var stop = {
                origin: itinerary.day[day.day].places[currPlace].origin.name,
                destination: itinerary.day[day.day].places[currPlace].destination.name,
                transitOptions: {
                    departureTime: new Date(itinerary.day[day.day].places[currPlace].commute.visitTime), 
                },
                travelMode: getTravelMethod(itinerary, day.day, currPlace)
            }
            requests.push(stop)
        } 
        for (let i = 0; i < requests.length; i++) {
            const renderer = new google.maps.DirectionsRenderer();
            renderer.setMap(map);
            renderers.push(renderer);
          
            await Promise.all([
              new Promise<void>((resolve, reject) => {
                directionsService.route(requests[i], (result, status) => {
                  if (status == 'OK') {
                    if (result != null) {
                      directions.push(result);
                      console.log(result);
                      renderer.setDirections(result);
                      const route = result.routes[0];
                      for (let j = 0; j < route.legs.length; j++) {
                        const steps = route.legs[j].steps;
                        for (let k = 0; k < steps.length; k++) {
                          instructions.push(steps[k].instructions!);
                        }
                      }
                      resolve();
                    } else {
                      reject();
                    }
                  }
                });
              }),
            ]);
          }
          
          console.log('directions', directions);
          
          const summaryPanel = document.getElementById(
            'directions-panel'
          )!;
          console.log(directions.length);
          for (let i = 0; i < directions.length; i++) {
            const routeSegment = i + 1;
            const button = document.createElement('button');
            button.innerText = 'Route Segment ' + routeSegment;
            button.addEventListener('click', () => {
              directionsRenderer.setDirections(directions[i]);
              const route = directions[i].routes[0];
              const overviewPath = route.overview_path;
              const bounds = new google.maps.LatLngBounds();
              for (let j = 0; j < overviewPath.length; j++) {
                bounds.extend(overviewPath[j]);
              }
              map.fitBounds(bounds);
            });
          
            const route = directions[i].routes[0].legs;

            summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment + '</b><br>';
            summaryPanel.innerHTML += requests[i].origin + ' to ';
            summaryPanel.innerHTML += requests[i].destination + '<br>';
            for (let j = 0; j < route[0].steps.length; j++) {
              const steps = route[0].steps[j];
              summaryPanel.innerHTML += instructions[j] + ' in ' + steps.distance!.text + '<br>';
            }
          
            summaryPanel.appendChild(button);
          }
          
          directionsRenderer.setMap(map);
          stepDisplay = new google.maps.InfoWindow();
        
        // const directions: any[] = [];
        // const instructions: any[] = [];
        

        // for (let i = 0; i < requests.length; i++) {
        //     const renderer = new google.maps.DirectionsRenderer();
        //     renderer.setMap(map);
        //     renderers.push(renderer);
            
        //     await Promise.all([new Promise((resolve, reject) => {
        //       directionsService.route(requests[i], (result, status) => {
        //         if (status == 'OK') {
        //           if(result != null){
        //             directions.push(result);
        //             console.log(result)
        //             renderers[i].setDirections(result);
        //             const route = result.routes[0];
        //             for (let j = 0; j < route.legs.length; j++) {
        //               const steps = route.legs[j].steps;
        //               for(let k = 0; k < steps.length; k++){
        //                 instructions.push(steps[k].instructions);
        //               }
        //             }
        //           } else {
        //             reject();
        //           }
        //         }
        //       });
        //     })]);
        //   }

        // console.log("directions", directions)
        //   const summaryPanel = document.getElementById(
        //     "directions-panel"
        // ) as HTMLElement;
        // console.log(directions.length)
        // for(let i = 0; i < directions.length; i++){
        //     const routeSegment = i + 1;
        //     const route = directions[i].routes[0].legs
        //     summaryPanel.innerHTML += "<b>Route Segment: " + routeSegment + "</b><br>";
        //     summaryPanel.innerHTML += directions[i].request.origin.query + " to ";
        //     summaryPanel.innerHTML += directions[i].request.destination.query + "<br>";
        //     for(let j = 0; j < route[0].steps.length; j++){
        //         const steps = route[0].steps[j]
        //         // console.log(steps)
        //         // console.log(instructions)
        //         summaryPanel.innerHTML += instructions[j] + " in "+ steps.distance!.text + "<br>";
        //     }
        // }


        // directionsRenderer.setMap(map);

        // stepDisplay = new google.maps.InfoWindow();
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
            <div className="itinerary-container">
                <div className='maps'> 
                    <ItineraryPageGoogleMap></ItineraryPageGoogleMap>
                </div>
                <div className="directions" id="directions-panel"></div>
            </div>
            </React.StrictMode>
        </div>

    );
}
export default ItineraryPage;