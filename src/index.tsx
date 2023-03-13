import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import reportWebVitals from './reportWebVitals';
import GoogleMapSearchBar from './GoogleMapSearchBar';
import MainPageGoogleMap from './MainPageGoogleMap';
import UserExtraInputOptions from './UserExtraInputOptions';
import SavedLocation from './SavedLocation';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Container>
      <GoogleMapSearchBar />
          <Row>
            <Col ><MainPageGoogleMap /></Col>
            <Col xs={6} md={4}><SavedLocation /></Col>
          </Row>
        <UserExtraInputOptions />
    </Container>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
