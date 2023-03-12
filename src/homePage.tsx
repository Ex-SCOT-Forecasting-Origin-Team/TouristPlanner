import React from 'react';
import ReactDOM from 'react-dom/client';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './css/index.css';
import reportWebVitals from './reportWebVitals';
import GoogleMapSearchBar from './GoogleMapSearchBar';
import MainPageGoogleMap from './MainPageGoogleMap';
import UserExtraInputOptions from './UserExtraInputOptions';

import SavedLocation from './SavedLocation';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function HomePage(){
    const navigate = useNavigate();
    const navigateToPage = () => {  
        navigate({
        pathname: "/Itinerary"
        });
    };;

    const [searchParams] = useSearchParams();
    
    return(
        <React.StrictMode>
        <Container>
          <GoogleMapSearchBar />
              <Row>
                <Col ><MainPageGoogleMap /></Col>
                <Col xs={6} md={4}><SavedLocation /></Col>
              </Row>
            <UserExtraInputOptions />
            <button onClick={() => navigateToPage()}>
                View Itnerary
            </button>
        </Container>
    );
}

export default HomePage;