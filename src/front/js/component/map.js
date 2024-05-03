import React, { useEffect, useContext, useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import { Modal } from 'react-bootstrap';
import L from 'leaflet';
import map from '../../styles/map.css';
import 'leaflet/dist/leaflet.css';
import logo from "../../img/logo.png";

import ChatForm from './chatform';
import { Container, Row, Col } from 'react-bootstrap';


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
    console.log("HANDLEGEOLOCATION");
    console.log(currentLocation);
    (currentLocation &&
      map.setView([currentLocation?.latitude, currentLocation?.longitude], 13));
  };

  const addMarkersToMap = () => {
    store?.active_users.map((user, index) => {
      const customIcon = L.icon({
        iconUrl: user.user_mood.icon_mood,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });
      if (!user.location) {
    
        return;
      }
     
      const marker = L.marker([user.location.latitude, user.location.longitude], { icon: customIcon }).addTo(finalMap);
      const popupContent = `<div key=${index}>
              <h6>${user.name} ${user.surnames}</h6>
              <p>Hobbie: ${user.hobbie}</p>  
              <a href='#' id=${user.id} data-name="${user.name}" class="chat-button btn btn-dark rounded-pill text-white">Chat &rarr;</a> 
              <a href="/${user.id}/${user.profile_url}" class="details-button btn btn-dark rounded-pill text-white">Ver perfil &rarr;</a>
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
      //obtiene todas las localizaciones activas y guarda la ubicación del usuario ( tambien llama a allactiveusers )
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
    }


    
}, [isMapInitialized, currentLocation]);

  // inicializar el mapa y manejar la geolocalización
  useEffect(() => {
    waterMark();
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
            setIsMapInitialized(true); 
          }
        );
      } else {
        console.log("Geolocalización no es soportada por este navegador.");
        setIsMapInitialized(true); 
      }
    };

    getLocation();

    // listener para el evento popupopen
    if (!finalMap) {
      return;
    }  
    finalMap.on('popupopen', (e) => {
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
        buttonChat.addEventListener('click', (e) => {
          setShowChatModal(true);
          actions.handleUserClick(e.target.id)
          setUserName(e.target.dataset.name);


        });
      }

    });

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
              {/* <h4 className='base-paragrahp'>Chatea con {userName}</h4><button className='button-login' onClick={handleCloseChatModal}>
                Cancelar
              </button> */}

              <ChatForm userName={userName} setShowChatModal={setShowChatModal} />

            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default MapComponent;

