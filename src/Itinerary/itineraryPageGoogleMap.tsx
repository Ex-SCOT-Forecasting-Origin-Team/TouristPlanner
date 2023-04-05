import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader , useLoadScript, MarkerF, InfoWindow, } from "@react-google-maps/api";
import '../css/GoogleMapEntity.css'
import GoogleMapEntity from '../GoogleMapEntity';


function ItineraryPageGoogleMap() {
    return (
        <div className="itinerary-container py-2 d-flex flex-column mvh-100 text-center">
            <div className="row py-3 flex-grow-1">
                <div className="col-12">
                    <div className="card shadow h-100">
                        <GoogleMapEntity />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItineraryPageGoogleMap


