import React, { useState } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default function UserExtraInputOptions() {
  const clickGenerateItinerary = (e: React.FormEvent) => {
    e.preventDefault();
  }


  return (
    <Form onSubmit={clickGenerateItinerary}>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridDays">
          <Form.Label>How many days is your trip?</Form.Label>
          <Form.Control type="days" placeholder="3" />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        {/* https://developers.google.com/maps/documentation/places/web-service/supported_types */}
        <Form.Group as={Col} controlId="formGridStartTime">
          <Form.Label>StartTime</Form.Label>
          <Form.Control type="time" placeholder="09:00" />
        </Form.Group>
        <Form.Group as={Col} controlId="formGridEndTime">
          <Form.Label>EndTime</Form.Label>
          <Form.Control type="time" placeholder="17:00" />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridtype">
          <Form.Label>Transportation</Form.Label>
          <Form.Select defaultValue="Public Transportation">
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