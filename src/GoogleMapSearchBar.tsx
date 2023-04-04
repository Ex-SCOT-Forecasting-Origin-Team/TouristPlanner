import React, { useState, useEffect } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { parse } from 'date-fns';
import { renderToStaticMarkup } from "react-dom/server"
import { Constraint  } from "./Model/constraint"
import { Site  } from "./Model/site"


export default function GoogleMapSearchBar({savedLocation, setSavedLocation}: {savedLocation: Constraint[], setSavedLocation: (childState: Array<Constraint>) => void}) {
  const clickSearchGoogleMap = (e: React.FormEvent) => {
    e.preventDefault();
    const searchKeyWord = document.getElementById("searchkeyWord") as HTMLInputElement;
    const searchType = document.getElementById("searchType") as HTMLInputElement;
    searchPlace(searchKeyWord.value, searchType.value)
  }

  const searchPlace = (searchKeyWord: string, searchType: string) => {
    const searchCallBack = (placeResults_: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        
        let placeResults = placeResults_ as google.maps.places.PlaceResult[];
        const firstlocation = placeResults[0].geometry as google.maps.places.PlaceGeometry
        const firstlatlng = firstlocation.location as google.maps.LatLng
        const map = new window.google.maps.Map(document.getElementById("map") as HTMLElement, {
            zoom: 12,
            center: firstlatlng,
        });

        console.log(placeResults[0])
        for (let idx=0; idx<savedLocation.length; idx++){
          const marker = new google.maps.Marker({
            position: savedLocation[idx].getSite().getCoordinate(),
            map: map,
            label: (idx+1).toString()
          });
        }

        for (let idx = 0; idx < placeResults.length; idx++){
          const placeResult = placeResults[idx]
          const location = placeResult.geometry as google.maps.places.PlaceGeometry
          const latlng = location.location as google.maps.LatLng
          const marker = new google.maps.Marker({
            position: latlng as google.maps.LatLng,
            map: map
          });
          

          const contentString = () => { return (
            <div>
            <h4>{placeResult.name} {placeResult.rating}</h4>
            <Form>

              <Row className="mb-3">
                <Form.Group as={Col} controlId="startTime">
                    <Form.Label>startTime</Form.Label>
                    <Form.Control type="time"/>
                </Form.Group>
                <Form.Group as={Col} controlId="endTime">
                    <Form.Label>endTime</Form.Label>
                    <Form.Control type="time"/>
                </Form.Group>
              </Row>

              <Button type="button" id="savePlaceButton">
                  Save Place
              </Button>
            </Form>
            </div>
          )}

          const infowindow = new google.maps.InfoWindow({
            content: renderToStaticMarkup(contentString())
          });

          marker.addListener("click", () => {
            infowindow.open({
              anchor: marker,
              map,
            })
          });

          google.maps.event.addListener(infowindow, 'domready', function() {
            const elt = document.getElementById('savePlaceButton') as Element
            elt.addEventListener("click", saveLocation);
            function saveLocation() {
              const startTime = document.getElementById("startTime") as HTMLInputElement;
              const endTime = document.getElementById("endTime") as HTMLInputElement;

              const parsedStartTime = parse(startTime.value, 'hh:mm', new Date());
              const parsedEndTime = parse(endTime.value, 'hh:mm', new Date());
              let duration = (parsedEndTime.getTime() - parsedStartTime.getTime()) / 1000
              if (isNaN(duration) || duration <= 0){
                duration = 3600
              }

              let opening_hours: null | google.maps.places.PlaceOpeningHoursPeriod[] = null
              if(placeResult.opening_hours != undefined && placeResult.opening_hours.periods != undefined){
                opening_hours = placeResult.opening_hours.periods as google.maps.places.PlaceOpeningHoursPeriod[]
              } 

              const site = new Site(placeResult.name as String, latlng, opening_hours);
              const newLocation = new Constraint(site, startTime.value, duration);

              savedLocation.push(newLocation)
              setSavedLocation(savedLocation)
            }
          });

        }
      }
    }

    let request = {
      query: searchKeyWord,
      fields: ["ALL"]
    };

    let service = new window.google.maps.places.PlacesService(document.getElementById('map2') as HTMLDivElement);
    service.findPlaceFromQuery(request, searchCallBack);
  }
  

  return (
    <Form onSubmit = {clickSearchGoogleMap}>
      <Row className="mb-3">
        <Form.Group as={Col}>
          <Form.Label>Place</Form.Label>
          <Form.Control name="searchkeyWord" type="searchKeyWord" id="searchkeyWord" placeholder="Search Google Map"/>
        </Form.Group>

        {/* https://developers.google.com/maps/documentation/places/web-service/supported_types */}
        <Form.Group as={Col}>
          <Form.Label>Location Type</Form.Label>
          <Form.Select defaultValue="tourist_attraction" id="searchType">
            <option>tourist_attraction</option>
            <option>restaurant</option>
          </Form.Select>
        </Form.Group>
      </Row>

      <Button variant="primary" type="submit">
          Search
      </Button>
    </Form>
  );
}