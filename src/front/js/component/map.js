import React, { useEffect, useContext, useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import { Modal } from 'react-bootstrap';
import L from 'leaflet';
import map from '../../styles/map.css';
import 'leaflet/dist/leaflet.css';
import logo from "../../img/logo.png";


const MapComponent = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [showLocationModal, setShowLocationModal] = useState(true);
  const [hasAcceptedModal, setHasAcceptedModal] = useState(false);
  const [ finalMap, setFinalMap ] = useState(null);


  // Inicializa el mapa y la posicion de watermark
  const initializeMap = (map_id) => {
    console.log("INICIANDO MAPA");
    const map = L.map(map_id);
    console.log(map);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    console.log(map);
    // Agrega la marca de agua después de que el mapa se haya inicializado
    L.control.watermark({ position: 'bottomright' }).addTo(map);
    setFinalMap(map);
    
    return map;
  };
  


  // obtener geolocalización
  const handleGeolocation = (map) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 13);     
        // agregar marca circular en la posicion del usuario
        // L.circle([latitude, longitude], {
        //   color: '#FF86D2',
        //   fillColor: '#FF86D2',
        //   fillOpacity: 0.19,
        //   radius: 15000,
        // }).addTo(map);
      }, (error) => {
        console.error('Error getting location', error);
      });
    } else {
      console.log('Geolocation not supported in this browser');
    }
  };


  // Agrega marcadores al mapa
  const addMarkersToMap = (map, locations) => {
    locations.map((user) => {
      const customIcon = L.icon({
        iconUrl: user.user_mood.category_mood.icon_url,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });
      if (!user.location) {
        // console.log("ESTE USUARIO NO TIENE LOCALIZACION");
        return;
      }
      const marker = L.marker([user.location.latitude, user.location.longitude], { icon: customIcon }).addTo(map);
      const popupContent = `<div>
                <h6>${user.name}</h6>
                <p>Hobbie: ${user.hobbie}</p>   
                <a href="/${user.id}/${user.profile_url}" class="details-button btn btn-dark rounded-pill text-white">Ver perfil &rarr;</a>
            </div>`;
      marker.bindPopup(popupContent);
    })
  };


  //control watermark
  const waterMark = () => {
    L.Control.Watermark = L.Control.extend({
      onAdd: function () {
        var img = L.DomUtil.create('img');
        img.src = logo;
        img.style.width = '200px';
        return img;
      },
      onRemove: function () {
      }
    });
    L.control.watermark = function (opts) {
      return new L.Control.Watermark(opts);
    }
  }


  const requestLocation = async () => {
    try {
      //obtiene todas las localizaciones activas
      //guarda la ubicación del usuario
      await actions.requestUserLocation();
      await actions.saveUserLocation();
      await actions.getAllActiveUsers();
      addMarkersToMap(finalMap, store?.active_users);

      //cerrar modal
      handleCloseLocationModal();
    } catch (error) {
      console.log('Error getting location:');
    }
  };

    // Cuando el usuario cierra el modal
    const handleCloseLocationModal = () => {
      setShowLocationModal(false);
    };
  
    // Cuando el usuario acepta el modal, solicita la ubicación
    const handleAcceptLocationModal = () => {
      setShowLocationModal(false);
      setHasAcceptedModal(true);
      requestLocation();
    };
  
  // inicializar el mapa y manejar la geolocalización
  useEffect(() => {
    waterMark();
   
    const map = initializeMap("map_id");
    handleGeolocation(map);
    
    // listener para el evento popupopen
    map.on('popupopen', (e) => {
      // contenido del popup
      const button = e.popup._contentNode.querySelector('.details-button');
      if (button) {
        // listener de clic al botón
        button.addEventListener('click', () => {
          const id = button.getAttribute('data-id');
          navigate(`/details/${id}`);
        });
      }
    });

    return () => {
      map.remove();
    };

  }, []);  


  return (
    <>
      <div id="map_id" className='map-styles' style={{ height: '100vh', width: '100%' }}></div>
      <Modal show={showLocationModal} onHide={handleCloseLocationModal}>
        <Modal.Header closeButton>
          <Modal.Title className='heading1'>Solicitar Geolocalización</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='base-paragrahp'>Este sitio web desea conocer tu ubicación aproximada para proporcionar servicios personalizados. No te preocupes, no es tu ubicación real. </p>
          <button className='button-login' onClick={handleAcceptLocationModal}>
            Aceptar
          </button>
          <button className='button-login' onClick={handleCloseLocationModal}>
            Cancelar
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MapComponent;


