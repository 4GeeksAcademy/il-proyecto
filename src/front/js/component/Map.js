import React, { useContext, useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import customIconUrl from '../../img/emot-angry.png';
import { Context} from '../store/appContext';
import '../../styles/map.css';

const MapComponent = () => {
  const { store, actions } = useContext(Context); // Obtiene el estado y las acciones del contexto
  
  useEffect(() => {
    // Carga las ubicaciones al montar el componente
    actions.saveUserLocation();
    

    // Guarda la ubicación del usuario al cargar el componente
    actions.getAllLocations();
  }, []); // Ejecuta solo una vez al montar el componente


  console.log(store.location);

  useEffect(() => {
      // Inicializa el mapa y establece la vista inicial
      const map = L.map('map');
    
      // Agrega una capa de azulejos (tiles) de OpenStreetMap al mapa
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);
    
      if (store.location && Array.isArray(store.location.results) && store.location.results.length > 0) {
        const addedLocationIds = new Set(); // Conjunto para evitar duplicados de marcadores
    
        store.location.results.forEach((location) => {
          const { id, latitude, longitude } = location;
    
          if (!addedLocationIds.has(id)) {
            // Crea un ícono personalizado para el marcador
            const customIcon = L.icon({
              iconUrl: customIconUrl,
              iconSize: [40, 40],
              iconAnchor: [20, 40],
            });
    
            // Crea y agrega el marcador al mapa
            L.marker([latitude, longitude], { icon: customIcon })
              .bindPopup(`Ubicación ${id}`)
              .addTo(map);
    
            // Agrega el ID al conjunto para evitar duplicados
            addedLocationIds.add(id);
          }
        });
    
        // Centra el mapa en la primera ubicación de la lista
        const firstLocation = store.location.results[0];
        map.setView([firstLocation.latitude, firstLocation.longitude], 11);
      
      // Crea un círculo alrededor de la primera ubicación con un radio de 5 kilómetros (5000 metros)
        const circle = L.circle([firstLocation.latitude, firstLocation.longitude], {
          color: 'red', // Color del borde del círculo
          fillColor: '#f03', // Color de relleno del círculo
          fillOpacity: 0.1, // Opacidad del relleno
          radius: 10000, // Radio en metros (en este caso, 5 kilómetros)
          }).addTo(map);
          }
        
    
      return () => {
        map.remove(); // Limpia el mapa al desmontar el componente
      };
    }, [store.location]); // Ejecuta cuando las ubicaciones cambian
    
    return <div id="map" style={{ height: '570px', width: '100%' }}></div>; // Renderiza el contenedor del mapa
    };


export default MapComponent;


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
