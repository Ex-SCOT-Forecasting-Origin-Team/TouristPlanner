import React, { useState } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { renderToStaticMarkup } from "react-dom/server"


export default function GoogleMapSearchBar() {
  const clickSearchGoogleMap = (e: React.FormEvent) => {
    e.preventDefault();
    const searchKeyWord = document.getElementById("searchkeyWord") as HTMLInputElement;
    const searchType = document.getElementById("searchType") as HTMLInputElement;
    searchPlace(searchKeyWord.value, searchType.value)
  }

  const clickSavePlace = (e: React.FormEvent) => {
    e.preventDefault();
    const searchKeyWord = document.getElementById("searchkeyWord") as HTMLInputElement
    searchKeyWord.innerText = ""
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

        for (let idx = 0; idx < placeResults.length; idx++){
          console.log(placeResults[idx])
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
                <Form.Group as={Col} controlId="locationStartTime">
                  <Form.Label>StartTime</Form.Label>
                  <Form.Control type="time" placeholder="09:00" />
                </Form.Group>
                <Form.Group as={Col} controlId="locationEndTime">
                  <Form.Label>EndTime</Form.Label>
                  <Form.Control type="time" placeholder="17:00" />
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
            elt.addEventListener("click", yourFucntionToCall);
            function yourFucntionToCall() {
              const locationStartTime = document.getElementById("locationStartTime") as HTMLInputElement;
              const locationEndTime = document.getElementById("locationEndTime") as HTMLInputElement;
              alert(locationStartTime.value)
              // TODO create a layout and put it on the side
            }
          });

        }
      }
    }

    let request = {
      type: searchType,
      query: searchKeyWord,
      radius: 50000,
      location: new google.maps.LatLng(-34, 151)
    };

    let service = new window.google.maps.places.PlacesService(document.getElementById('map2') as HTMLDivElement);
    service.textSearch(request, searchCallBack);
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