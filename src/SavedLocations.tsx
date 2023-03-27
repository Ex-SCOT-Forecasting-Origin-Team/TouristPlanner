import { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { LocationInfo } from "./locationClass"

function SavedLocations({savedLocation, seed}: {savedLocation: LocationInfo[], seed: number}) {
  const SavedLocation = (i: number) => {
    return (
      <Accordion defaultActiveKey="{i}">
      <Accordion.Item eventKey="{i}">
        <Accordion.Header> {i+1}. {savedLocation[i].site.name}</Accordion.Header>
        <Accordion.Body>
          {"visitTime : "+savedLocation[i].visitTime} <br></br>
          {"duration : "+savedLocation[i].duration} <br></br>
          {"coordinate : "+savedLocation[i].site.coordinate} <br></br>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    )
  }


  return (
    <div>
      { Array.from(Array(savedLocation.length).keys()).map(SavedLocation) }
    </div>
  );
}

export default SavedLocations;