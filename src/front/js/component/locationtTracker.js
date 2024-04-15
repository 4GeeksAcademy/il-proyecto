import React, { useEffect } from 'react';
import axios from 'axios';

const LocationTracker = () => {
  useEffect(() => {
    
    const trackUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              // Enviar la ubicación del usuario al backend Flask
              await axios.post('https://cuddly-happiness-7vvvx7wrjp64hppg-3001.app.github.dev/api/location', {
                latitude,
                longitude
              });
              console.log('Ubicación del usuario enviada con éxito.');
            } catch (error) {
              console.error('Error al enviar ubicación del usuario:', error);
            }
          },
          (error) => {
            console.error('Error al obtener la ubicación del usuario:', error);
          }
        );
      } else {
        console.error('Geolocalización no compatible.');
      }
    };

    trackUserLocation();
  }, []);

  

  return <div>Tracking user location...</div>;
};

export default LocationTracker;
