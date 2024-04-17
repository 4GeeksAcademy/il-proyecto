import React, { useEffect, useContext, useState,} from 'react';
import { Context } from '../store/appContext';
import { Modal, Button } from 'react-bootstrap';
import customIconUrl from '../../img/emot-angry.png';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const { store, actions } = useContext(Context);
  const [showLocationModal, setShowLocationModal] = useState(true);

  const handleCloseLocationModal = () => {
    setShowLocationModal(false);
  };

  const requestLocation = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      // Llamar a la función saveUserLocation() para guardar la ubicación del usuario
      actions.saveUserLocation(latitude, longitude);

      // Cerrar el modal después de obtener la ubicación exitosamente
      handleCloseLocationModal();
    } catch (error) {
      console.error('Error getting location:', error.message);
    }
  };

  useEffect(() => {
    actions.getAllLocations(); // Cargar las ubicaciones al montar el componente
  }, []); // Ejecutar solo una vez al montar el componente

  useEffect(() => {
    const map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    if (store.location && Array.isArray(store.location.results) && store.location.results.length > 0) {
      const addedLocationIds = new Set();

      store.location.results.forEach((location) => {
        const { id, latitude, longitude } = location;

        if (!addedLocationIds.has(id)) {
          const customIcon = L.icon({
            iconUrl: customIconUrl,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
          });

          const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);

          const popupContent = `<div>
            <h3>Ubicación ${id}</h3>
            <p>Latitud: ${latitude}</p>
            <p>Longitud: ${longitude}</p>
            <button onclick="handleClick(${id})">Ver detalles</button>
          </div>`;

          marker.bindPopup(popupContent);
          addedLocationIds.add(id);
        }
      });

      // Centra el mapa en la última ubicación de la lista
      const lastLocation = store.location.results[store.location.results.length - 1];
      map.setView([lastLocation.latitude, lastLocation.longitude], 11);

      // Crea un círculo alrededor de la última ubicación con un radio de 5 kilómetros
      L.circle([lastLocation.latitude, lastLocation.longitude], {
        color: 'blue',
        fillColor: 'blue',
        fillOpacity: 0.1,
        radius: 5000,
      }).addTo(map);
    }

    // Función para manejar el clic en el botón del popup
    window.handleClick = (id) => {
      // Redirige al usuario a una ruta específica dentro de tu aplicación
      navigate(`/details/${id}`);
    };

    return () => {
      map.remove();
      delete window.handleClick;
      actions.clearUserLocation();
    };
  }, [store.location]); // Ejecutar cuando cambia store.location

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
          <Button variant="secondary" onClick={handleCloseLocationModal}>
            Cancelar
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MapComponent;
// import React, { useContext, useEffect, useState } from 'react';
// import L, { Popup } from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import customIconUrl from '../../img/emot-angry.png';
// import { Context} from '../store/appContext';
// import '../../styles/map.css';
// import { useNavigate } from 'react-router-dom';

// const MapComponent = () => {
//   const { store, actions } = useContext(Context); // Obtiene el estado y las acciones del contexto
//   const navigate = useNavigate(); // Obtiene la función de navegación

//   console.log(store.location);
  
//   useEffect(() => {
//     // Guarda la ubicación del usuario al cargar el componente
//     // actions.saveUserLocation();
    
//     // Carga las ubicaciones al montar el componente
//     actions.getAllLocations();
//   }, []); // Ejecuta solo una vez al montar el componente


//   console.log(store.location);

//   useEffect(() => {
//     const map = L.map('map');

//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '&copy; OpenStreetMap contributors',
//     }).addTo(map);

//     if (store.location && Array.isArray(store.location.results) && store.location.results.length > 0) {
//       const addedLocationIds = new Set();

//       store.location.results.forEach((location) => {
//         const { id, latitude, longitude } = location;

//         if (!addedLocationIds.has(id)) {
//           const customIcon = L.icon({
//             iconUrl: customIconUrl,
//             iconSize: [40, 40],
//             iconAnchor: [20, 40],
//           });

//           const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);

//           const popupContent = `<div>
//             <h3>Ubicación ${id}</h3>
//             <p>Latitud: ${latitude}</p>
//             <p>Longitud: ${longitude}</p>
//             <button onclick="handleClick(${id})">Ver detalles</button>
//           </div>`;

//           marker.bindPopup(popupContent);
//           addedLocationIds.add(id);
//         }
//       });
      
//       // Centra el mapa en la última ubicación de la lista
//       const lastLocation = store.location.results[store.location.results.length - 1];
//       map.setView([lastLocation.latitude, lastLocation.longitude], 11);

//       // Crea un círculo alrededor de la última ubicación con un radio de 5 kilómetros
//       L.circle([lastLocation.latitude, lastLocation.longitude], {
//         color: 'blue',
//         fillColor: 'blue',
//         fillOpacity: 0.1,
//         radius: 5000,
//       }).addTo(map);
//     }

//     // Función para manejar el clic en el botón del popup
//     window.handleClick = (id) => {
//       // Redirige al usuario a una ruta específica dentro de tu aplicación
//       navigate(`/details/${id}`);
//     };

//     return () => {
//       map.remove();
//       delete window.handleClick;
//       actions.clearUserLocation();
//     };
//   }, [store.location, navigate]);
    
//     return <div id="map" style={{ height: '570px', width: '100%' }}></div>; // Renderiza el contenedor del mapa
//     };


// export default MapComponent;


// useEffect(() => {
//   // Inicializa el mapa y establece la vista inicial
//   const map = L.map('map');

//   // Agrega una capa de azulejos (tiles) de OpenStreetMap al mapa
//   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; OpenStreetMap contributors',
//   }).addTo(map);

//   if (store.location && Array.isArray(store.location.results) && store.location.results.length > 0) {
//     const addedLocationIds = new Set(); // Conjunto para evitar duplicados de marcadores

//     store.location.results.forEach((location) => {
//       const { id, latitude, longitude } = location;

//       if (!addedLocationIds.has(id)) {
//         // Crea un ícono personalizado para el marcador
//         const customIcon = L.icon({
//           iconUrl: customIconUrl,
//           iconSize: [40, 40],
//           iconAnchor: [20, 40],
//         });

//         // Crea y agrega el marcador al mapa
//         L.marker([latitude, longitude], { icon: customIcon })
//           .bindPopup(`Ubicación ${id}`)
//           .addTo(map);

//         // Agrega el ID al conjunto para evitar duplicados
//         addedLocationIds.add(id);
//       }
//     });

//     // Centra el mapa en la primera ubicación de la lista
//     const firstLocation = store.location.results[0];
//     map.setView([firstLocation.latitude, firstLocation.longitude], 11);
  
//   // Crea un círculo alrededor de la primera ubicación con un radio de 5 kilómetros (5000 metros)
//     const circle = L.circle([firstLocation.latitude, firstLocation.longitude], {
//       color: 'red', // Color del borde del círculo
//       fillColor: '#f03', // Color de relleno del círculo
//       fillOpacity: 0.1, // Opacidad del relleno
//       radius: 10000, // Radio en metros (en este caso, 5 kilómetros)
//       }).addTo(map);
//       }
    

//   return () => {
//     map.remove(); // Limpia el mapa al desmontar el componente
//   };
// }, [store.location]); // Ejecuta cuando las ubicaciones cambian

// return <div id="map" style={{ height: '500px', width: '100%' }}></div>; // Renderiza el contenedor del mapa
// };

// export default MapComponent;


  // Centra el mapa en la ubicación del usuario

                // Función para centrar el mapa en la ubicación del usuario
        // const centerMapToUserLocation = async () => {
        //   try {
        //     if (navigator.geolocation) {
        //       navigator.geolocation.getCurrentPosition((position) => {
        //         const { latitude, longitude } = position.coords;
        //         map.setView([latitude, longitude], 13); // Centra el mapa en la ubicación del usuario
        //       }, (error) => {
        //         console.error('Error obtaining user location:', error);
        //       });
        //     } else {
        //       console.error('Geolocation is not supported by this browser.');
        //     }
        //   } catch (error) {
        //     console.error('Error setting user location:', error);
        //   }
        // };

        // // Centra el mapa en la ubicación del usuario al cargar el componente
        // centerMapToUserLocation();