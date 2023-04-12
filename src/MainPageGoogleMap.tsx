import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader , useLoadScript, MarkerF, InfoWindow, } from "@react-google-maps/api";
// import './css/GoogleMapEntity.css'
import GoogleMapEntity from './GoogleMapEntity';
import { Constraint  } from "./Model/constraint"


function MainPageGoogleMap({savedLocation}: {savedLocation: Constraint[]}) {
    useEffect(() => {
        if(document.getElementById("map") != null){
            let centerLatlng = new google.maps.LatLng({ lat: 47.62, lng: -122.203})
            if(savedLocation.length >= 1){
                centerLatlng = savedLocation[0].getSite().getCoordinate()
            }

            const map = new window.google.maps.Map(document.getElementById("map") as HTMLElement, {
                zoom: 12,
                center: centerLatlng
            });

            for (let idx=0; idx<savedLocation.length; idx++){
                const marker = new google.maps.Marker({
                  position: savedLocation[idx].getSite().getCoordinate(),
                  map: map,
                  label: (idx+1).toString()
                });
            }
        }
    })

    return (
        <div className="container py-2 d-flex flex-column mvh-100 text-center">
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

export default MainPageGoogleMap


