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
    <Form onSubmit = {clickGenerateItinerary }>
      <Button variant="primary" type="submit">
        Generate Itinerary 
      </Button>
    </Form>
  );
}