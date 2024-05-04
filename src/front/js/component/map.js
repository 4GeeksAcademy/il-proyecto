import React, { useEffect, useContext, useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import L from 'leaflet';
import map from '../../styles/map.css';
import 'leaflet/dist/leaflet.css';
import logo from "../../img/logo.png";

import ChatForm from './chatform';
import { Container, Row, Col, Modal } from 'react-bootstrap';


const MapComponent = (props) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [showLocationModal, setShowLocationModal] = useState(true);
  const [hasAcceptedModal, setHasAcceptedModal] = useState(false);
  const [finalMap, setFinalMap] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [isGeolocationLoading, setIsGeolocationLoading] = useState(false);
  const [userName, setUserName] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({ latitude: null, longitude: null });
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  
  const handleGeolocation = (map) => {
    (currentLocation &&
      map.setView([currentLocation?.latitude, currentLocation?.longitude], 13));
  };

  const addMarkersToMap = () => {
    if (!store || !store.active_users.length) return; 

    const currentUserData = JSON.parse(sessionStorage.getItem('userData')); 
    const currentUserId = currentUserData ? currentUserData.id : null; 

    store.active_users.forEach((user, index) => {
        const iconUrl = user.user_mood && user.user_mood.icon_mood ?
            user.user_mood.icon_mood :
            `${process.env.FIREBASE_URL}/Home%2Fpin-map.png?alt=media&token=7e6f0e5a-0c9b-478b-b86d-13d56a159799`;          
 

        const customIcon = L.icon({
            iconUrl: iconUrl,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
        });
        // Determina la ubicación del usuario o usa la ubicación actual si es null.
        const userLocation = user.id === currentUserId ? [currentLocation.latitude, currentLocation.longitude] : [user.location.latitude, user.location.longitude];
        // const userLocation = user.location ? [user.location.latitude, user.location.longitude] : [currentLocation.latitude, currentLocation.longitude];
        // Crea el marcador en la ubicación determinada.
        const marker = L.marker(userLocation, { icon: customIcon }).addTo(finalMap);
        // Construye el contenido del popup con condición para mostrar el botón de chat solo si no es el usuario actual.
        const popupContent = `<div key=${index} class="custom-popup">
                <h5 class="mt-3">${user.name} ${user.surnames}</h5>` +
                (user.hobbie !== null ? `<p>Hobbie: ${user.hobbie}</p>` : '') +              
                (user.id !== currentUserId ? `<a href='#' id=${user.id} data-name="${user.name}" class="chat-button btn btn-dark rounded-pill text-white me-1">Chat &rarr;</a>` : '') +
                `<a href="/${user.id}/${user.profile_url}" class="details-button btn btn-dark rounded-pill text-white">Ver perfil &rarr;</a>
            </div>`;

        
        marker.bindPopup(popupContent);
    });
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

  const requestLocation = async (currentLocation) => {
    try {
      console.log("REQUEST LOCATION", currentLocation);
      await actions.saveUserLocation(currentLocation);
      addMarkersToMap();   
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

  const handleAcceptLocationModal = async () => {
    setIsGeolocationLoading(true);
    setHasAcceptedModal(true);
    try {

      await requestLocation(currentLocation);
    } catch (error) {
      console.log('Error getting location:', error);
    } finally {
      setIsGeolocationLoading(false);
      setShowLocationModal(false);
    }
  };

  
  const handleCloseChatModal = () => {
      setShowChatModal(false);
    };

  
  const handlePopUpOpen = (map) => {
         // listener para el evento popupopen
        map.on('popupopen', (e) => {
          // contenido del popup
          const buttonChat = e.popup._contentNode.querySelector('.chat-button');
          const button = e.popup._contentNode.querySelector('.details-button');
          if (button) {
            // listener de clic al botón
            button.addEventListener('click', () => {
              const id = button.getAttribute('data-id');
            });
          }
    
          if (buttonChat) {
            console.log("estoy haciendo click en el chat...");
            buttonChat.addEventListener('click', (e) => { 
              e.preventDefault();         
              setShowChatModal(true);
              actions.handleUserClick(e.target.id);
              setUserName(e.target.dataset.name);
            });
          }
        });
  }


  useEffect(() => {
    if (isMapInitialized) {
        const map = L.map('map_id', {
            scrollWheelZoom: false
        }).setView([currentLocation.latitude, currentLocation.longitude], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        L.control.watermark({ position: 'bottomright' }).addTo(map);
        setFinalMap(map);

        handleGeolocation(map);
        handlePopUpOpen(map);
    }


    
}, [isMapInitialized, currentLocation]);
const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setIsMapInitialized(true); 
      },
      (error) => {
        console.error("Error obteniendo la ubicación", error);
        setIsMapInitialized(false); 
      }
    );
  } else {
    console.log("Geolocalización no es soportada por este navegador.");
    setIsMapInitialized(false); 
  }
};
  // inicializar el mapa y manejar la geolocalización
  useEffect(() => {
    waterMark();
    

    getLocation();

    // listener para el evento popupopen
    if (!finalMap) {
      return;
    }  


    return () => {
      finalMap.remove();
    };

  }, []);


  return (
    <>
      <Container fluid>
        <Row>
          <Col xs={showChatModal ? 8 : 12}>
            <div id="map_id" className='map-styles' style={{ height: '100vh', width: '100%' }}></div>
            <Modal show={showLocationModal} onHide={handleCloseLocationModal}>
              <Modal.Header closeButton>
                <Modal.Title className='heading1'>Solicitar Geolocalización</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p className='base-paragrahp'>Este sitio web desea conocer tu ubicación aproximada para proporcionar servicios personalizados. No te preocupes, no es tu ubicación real. </p>
                <button className='button-login' onClick={handleAcceptLocationModal} disabled={isGeolocationLoading}>
                  {isGeolocationLoading ? 'Cargando...' : 'Aceptar'}
                </button>
                {!isGeolocationLoading ? <button className='button-login' onClick={handleCloseLocationModal}>
                  Cancelar
                </button> : ''}
              </Modal.Body>
            </Modal>
          </Col>
        
          {showChatModal && (  
            <Col xs={4} className='chat-heading'>
              <ChatForm userName={userName} setShowChatModal={setShowChatModal} />
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default MapComponent;

