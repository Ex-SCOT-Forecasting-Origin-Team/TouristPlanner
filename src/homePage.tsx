import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate } from 'react-router-dom';
import './css/index.css';
import GoogleMapSearchBar from './GoogleMapSearchBar';
import MainPageGoogleMap from './MainPageGoogleMap';
import UserExtraInputOptions from './UserExtraInputOptions';
import { Constraint  } from "./Model/constraint"
import SavedLocations from './SavedLocations';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function HomePage(){
    
    const [savedLocation, setSavedLocation] = useState<Array<Constraint>>([]);
    const [seed, setSeed] = useState(1);
    const handleSetSavedLocation = (childState: Array<Constraint>) => {
        setSavedLocation(childState)
        setSeed(Math.random())
    }

    return(
        <Container>
            <GoogleMapSearchBar savedLocation={savedLocation} setSavedLocation={handleSetSavedLocation}/>
            <Row>
                <Col ><MainPageGoogleMap savedLocation={savedLocation}/></Col>
                <Col xs={6} md={4}><SavedLocations savedLocation={savedLocation} seed={seed} setSavedLocation={handleSetSavedLocation}/></Col>
            </Row>
            <UserExtraInputOptions savedLocation={savedLocation}/>
        </Container>
    );
}

export default HomePage;