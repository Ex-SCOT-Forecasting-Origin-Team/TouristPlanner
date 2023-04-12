import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import reportWebVitals from './reportWebVitals';
import GoogleMapSearchBar from './GoogleMapSearchBar';
import MainPageGoogleMap from './MainPageGoogleMap';
import UserExtraInputOptions from './UserExtraInputOptions';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './homePage';
import ItineraryPage from './Itinerary/itineraryPage';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/Itinerary" element={<ItineraryPage />} />
    </Routes>
  </BrowserRouter>
);
