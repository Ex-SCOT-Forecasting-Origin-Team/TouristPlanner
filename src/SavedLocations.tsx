import { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { Constraint  } from "./Model/constraint"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function SavedLocations({savedLocation, seed, setSavedLocation}: {savedLocation: Constraint[], seed: number, setSavedLocation: (childState: Array<Constraint>) => void}) {
  const clickDeletePlace = (e: React.FormEvent, i: Number) => {
    e.preventDefault()
    setSavedLocation(savedLocation.slice(0, i as number).concat(savedLocation.slice(i as number+1)))
  }

  const SavedLocation = (i: number) => {
    return (
      <Accordion defaultActiveKey="{i}">
      <Accordion.Item eventKey="{i}">
        <Accordion.Header> {i+1}. {savedLocation[i].getSite().getName()}</Accordion.Header>
        <Accordion.Body>
          {"visitTime : "+savedLocation[i].getVisitTime()} <br></br>
          {"duration : "+savedLocation[i].getDuration()} <br></br>
          {"coordinate : "+savedLocation[i].getSite().getCoordinate()} <br></br> <br></br>
          <Form onSubmit = {(e: React.FormEvent) => {clickDeletePlace(e, i)}}>
            <Button variant="primary" type="submit">
              Delete
            </Button>
          </Form>
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