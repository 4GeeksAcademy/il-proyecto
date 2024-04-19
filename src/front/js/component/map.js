import React, { useEffect, useContext, useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import { Modal, Button } from 'react-bootstrap';
import customIconUrl from '../../img/emot-angry.png';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import map from '../../styles/map.css';
import logo from "../../img/logo.png";


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
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Agrega la marca de agua después de que el mapa se haya inicializado
    L.control.watermark({ position: 'bottomright' }).addTo(map);

    return map;
  };


  // obtener geolocalización
  const handleGeolocation = (map) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 11);
        L.circle([latitude, longitude], {
          color: '#FF86D2',
          fillColor: '#FF86D2',
          fillOpacity: 0.19,
          radius: 8000,
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


  const waterMark = () => {
    L.Control.Watermark = L.Control.extend({
      onAdd: function() {
        var img = L.DomUtil.create('img');
        img.src = logo;
        img.style.width = '200px';
        return img;
      },
      onRemove: function() {

      }
    });
  
    L.control.watermark = function(opts) {
      return new L.Control.Watermark(opts);
    }
  }

  

// inicializar el mapa y manejar la geolocalización
useEffect(() => {
  waterMark();
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
    waterMark();
  }
  

  return () => {
    map.remove();
  };
}, [store.location]); // Este efecto se ejecuta cada vez que cambia store.location

        

  return (
    <>
      <div id="map" className='map-styles' style={{ height: '570px', width: '100%' }}></div>
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

