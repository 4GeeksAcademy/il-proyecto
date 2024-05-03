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
  
 
  // Inicializa el mapa y la posicion de watermark
  const initializeMap = (map_id) => {
    console.log("INICIANDO MAPA");
    const map = L.map(map_id, {
      scrollWheelZoom: false  // Desactiva el zoom con la rueda del mouse
    });
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

  // Maneja la geolocalización del usuario y centra el mapa en su ubicación
  const handleGeolocation = async (map) => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                map.setView([latitude, longitude], 13);
                resolve();
            }, (error) => {
                console.error('Error getting location', error);
                reject(error);
            });
        } else {
            console.log('Geolocation not supported in this browser');
            reject(new Error('Geolocation not supported'));
        }
    });
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

  const requestLocation = async () => {
    try {
      //obtiene todas las localizaciones activas y guarda la ubicación del usuario ( tambien llama a allactiveusers )
      await actions.requestUserLocation();
      // Verifica que el mapa se haya inicializado antes de intentar agregar los marcadores
      if (finalMap) {
        addMarkersToMap(finalMap, store?.active_users);
      }
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

  // const handleCloseChatModal = () => {
  //   setShowChatModal(false);
  // };

  const handleAcceptLocationModal = async () => {
    setIsGeolocationLoading(true);
    setHasAcceptedModal(true);
    try {
        await handleGeolocation(finalMap);
        await requestLocation();
    } catch (error) {
        console.log('Error getting location:', error);
    } finally {
        setIsGeolocationLoading(false);
        setShowLocationModal(false);
    }
};

  //debemos tener separados los useEffect ya que el primer useEffect está manejando 
  // la adición de marcadores al mapa, mientras que el segundo está inicializando 
  //el mapa y manejando la geolocalización. Estas son tareas bastante diferentes, 
  //por lo que tiene sentido mantenerlas en useEffect separados.

  useEffect(() => {
    if (hasAcceptedModal && finalMap && store?.active_users) {
      addMarkersToMap(finalMap, store?.active_users);
    }
  }, [hasAcceptedModal]);


  // inicializar el mapa y manejar la geolocalización
  useEffect(() => {
    waterMark();

    const map = initializeMap("map_id");
    handleGeolocation(map);

    // listener para el evento popupopen
    map.on('popupopen', (e) => {
      // contenido del popup
      const buttonChat = e.popup._contentNode.querySelector('.chat-button');
      const button = e.popup._contentNode.querySelector('.details-button');
      if (button) {
        // listener de clic al botón
        button.addEventListener('click', () => {
          const id = button.getAttribute('data-id');
          navigate(`/details/${id}`);
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
      map.remove();
    };

  }, []);

  console.log("USERNAME", userName);
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
              
              <ChatForm userName={userName} setShowChatModal={setShowChatModal}/> 

            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default MapComponent;

