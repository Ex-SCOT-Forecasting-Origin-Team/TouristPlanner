import React, { useState } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { useSearchParams, useNavigate } from 'react-router-dom';
import { Constraint  } from "./Model/constraint"

export default function UserExtraInputOptions({savedLocation}: {savedLocation: Constraint[]}) {
  const navigate = useNavigate();
  const navigateToPage = () => {  
      navigate({
      pathname: "/Itinerary"
      });
  };;

  const clickGenerateItinerary = (e: React.FormEvent) => {
    e.preventDefault();

    let HomePageInput: any = {};
    HomePageInput.stayDurationEachDay = Array.from(Array(state["num"]).keys()).map((i:number) => {
      let formGridStartTime = "10:00";
      let formGridEndTime = "20:00";
      const formGridStartTimeElt = document.getElementById("formGridStartTime"+i.toString()) as HTMLInputElement;
      const formGridEndTimeElt = document.getElementById("formGridEndTime"+i.toString()) as HTMLInputElement;
      if(formGridStartTimeElt.value != ""){
        formGridStartTime = formGridStartTimeElt.value;
      }
      if(formGridEndTimeElt.value != ""){
        formGridEndTime = formGridEndTimeElt.value;
      }

      return [formGridStartTime, formGridEndTime]
    }) 

    const transportationType = document.getElementById("transportationType") as HTMLInputElement;
    HomePageInput.transportationType = transportationType.value

    HomePageInput.constraints = savedLocation

    console.log(HomePageInput)

    navigateToPage()
  }

  const [state, setState] = useState({"num": 1});

  const startTimeEndTime = (i: number) => { return (
    <Row className="mb-3">
        <Form.Group as={Col} controlId={"formGridStartTime"+i.toString()}>
          <Form.Label>StartTime{i+1}</Form.Label>
          <Form.Control type="time"/>
        </Form.Group>
        <Form.Group as={Col} controlId={"formGridEndTime"+i.toString()}>
          <Form.Label>EndTime{i+1}</Form.Label>
          <Form.Control type="time"/>
        </Form.Group>
    </Row>
  )}

  return (
    <Form onSubmit={clickGenerateItinerary}>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridDays">
          <Form.Label>How many days is your trip?</Form.Label>
          <Form.Control required type="number" value={state["num"]} onChange={(e) => setState(prevState => { return {...prevState, "num": +e.target.value}})}/>
        </Form.Group>
      </Row>

      { Array.from(Array(state["num"]).keys()).map(startTimeEndTime) }

      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridtype">
          <Form.Label>Transportation</Form.Label>
          <Form.Select defaultValue="Public Transportation" id="transportationType">
            <option>Public Transportation</option>
            <option>Car</option>
          </Form.Select>
        </Form.Group>
      </Row>

      <Button variant="primary" type="submit">
          Generate Itinerary 
      </Button>
    </Form>
  );
}