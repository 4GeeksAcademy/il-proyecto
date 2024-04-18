import React, { useEffect, useContext, useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import { Modal, Button } from 'react-bootstrap';
import customIconUrl from '../../img/emot-angry.png';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


const MapComponent = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [showLocationModal, setShowLocationModal] = useState(true);


  // Cuando el usuario cierra el modal
  const handleCloseLocationModal = () => {
    setShowLocationModal(false);
  };

  // Cuando el usuario acepta el modal, solicita la ubicación
  const handleAcceptLocationModal = () => {
    setShowLocationModal(false);
    requestLocation();
  };
    
  // pide localizacion al usuario
  const requestLocation = async () => {
    try {
      await actions.requestUserLocation();
      // Cerrar el modal después de obtener la ubicación exitosamente
      handleCloseLocationModal();
    } catch (error) {
      console.log('Error getting location:');
    }
  };
  
  // Inicializa el mapa
  const initializeMap = () => {
    const map = L.map('map').setView([9.935, -84.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    return map;
  };


  // obtener geolocalización
  const handleGeolocation = (map) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 11);
        L.circle([latitude, longitude], {
          color: 'blue',
          fillColor: 'blue',
          fillOpacity: 0.1,
          radius: 5000,
        }).addTo(map);
      }, (error) => {
        console.error('Error obteniendo la ubicación', error);
      });
    } else {
      console.log('Geolocalización no soportada en este navegador');
    }
  };


  // marcadores mapa
  const addMarkersToMap = (map, location, customIcon) => {
    location.forEach(({ id, latitude, longitude }) => {
      const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
      const popupContent = `<div>
        <h3>Ubicación ${id}</h3>
        <p>Latitud: ${latitude}</p>
        <p>Longitud: ${longitude}</p>
        <button class="details-button" data-id="${id}">Ver detalles</button>
      </div>`;
      marker.bindPopup(popupContent);
    });
  };

  

// inicializar el mapa y manejar la geolocalización
useEffect(() => {
  const map = initializeMap();
  handleGeolocation(map);

  // Agrega un listener para el evento popupopen
  map.on('popupopen', (e) => {
    // Busca el botón en el contenido del popup
    const button = e.popup._contentNode.querySelector('.details-button');
    if (button) {
      // Agrega un listener de clic al botón
      button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        navigate(`/details/${id}`);
      });
    }
  });

  // Agrega los marcadores al mapa
  if (store.location && Array.isArray(store.location.results) && store.location.results.length > 0) {
    console.log('Location data:', store.location.results); // Agrega esta línea
    const customIcon = L.icon({
      iconUrl: customIconUrl,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    addMarkersToMap(map, store.location.results, customIcon);
  }

  return () => {
    map.remove();
  };
}, [store.location]); // Este efecto se ejecuta cada vez que cambia store.location

        

  return (
    <>
      <div id="map" style={{ height: '570px', width: '100%' }}></div>
      <Modal show={showLocationModal} onHide={handleCloseLocationModal}>
        <Modal.Header closeButton>
          <Modal.Title>Solicitar Geolocalización</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Este sitio web desea conocer tu ubicación para proporcionar servicios personalizados.</p>
          <Button variant="primary" onClick={requestLocation}>
            Aceptar
          </Button>
          {/* Botón para que el usuario cierre el modal manualmente */}
          <Button variant="secondary" onClick={handleAcceptLocationModal}>
            Cancelar
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MapComponent;


// const requestLocation = async () => {
//   try {
    // console.log('Requesting location...');
    
    // const position = await new Promise((resolve, reject) => {
    //   navigator.geolocation.getCurrentPosition(resolve, reject);
    // });

    // const { latitude, longitude } = position.coords;

    // console.log('Got location:', latitude, longitude);
    
    // // Llamar a la función saveUserLocation() para guardar la ubicación del usuario
    // await actions.saveUserLocation(latitude, longitude);
    // await actions.getAllLocations();
    // console.log('Getting all locations...');
    // console.log('Saving user location...');
    // await actions.requestUserLocation();
    // Cerrar el modal después de obtener la ubicación exitosamente
    // handleCloseLocationModal();
//   } catch (error) {
//     console.log('Error getting location:');
//   }
// };