import { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { Constraint  } from "./Model/constraint"

function SavedLocations({savedLocation, seed}: {savedLocation: Constraint[], seed: number}) {
  const SavedLocation = (i: number) => {
    return (
      <Accordion defaultActiveKey="{i}">
      <Accordion.Item eventKey="{i}">
        <Accordion.Header> {i+1}. {savedLocation[i].getSite().getName()}</Accordion.Header>
        <Accordion.Body>
          {"visitTime : "+savedLocation[i].getVisitTime()} <br></br>
          {"duration : "+savedLocation[i].getDuration()} <br></br>
          {"coordinate : "+savedLocation[i].getSite().getCoordinate()} <br></br>
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