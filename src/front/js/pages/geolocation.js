import React, { useState, useEffect, useContext } from "react";
import { Context } from '../store/appContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import customIconUrl from '../../img/logo.png';
import { Container, Row, Col } from 'react-bootstrap';
import "../../styles/map.css";
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';


export const Geolocation = () => {

const { store, actions } = useContext(Context);

		useEffect(() => { actions.getAllLocations(), actions.saveUserLocation();}, []);

	console.log(store.location);

	


	useEffect(() => {
		const map = L.map('map').setView([51.505, -0.09], 3); // Ajusta el nivel de zoom según tus necesidades
	
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; OpenStreetMap contributors'
		}).addTo(map);
	
		// Conjunto para mantener IDs de ubicaciones agregadas al mapa
		const addedLocationIds = new Set();
	
		if (store.location && Array.isArray(store.location.results)) {
			store.location.results.forEach((location) => {
				const { id, latitude, longitude } = location;
	
				// Verificar si el ID de la ubicación ya fue agregado al mapa
				if (!addedLocationIds.has(id)) {
					const customIcon = L.icon({
						iconUrl: customIconUrl, // Reemplazar con la URL de tu ícono personalizado
						iconSize: [60, 20],
						iconAnchor: [20, 40]
					});
	
					L.marker([latitude, longitude], { icon: customIcon })
						.bindPopup(`Ubicación ${id}`)
						.addTo(map);
	
					// Agregar el ID de la ubicación al conjunto de IDs agregados
					addedLocationIds.add(id);
				}
			});
		}
	
		return () => {
			map.remove();
		};
	}, [store.location]);
	

	return (
				<Container className="map-app">
		
					<Row>
						<Col>
							<h1 className='button1'>¿ Sabes que hay muchas personas que se sienten igual que tú ?</h1>
						</Col>
					</Row>
					<Row>
						<Col>
							<h1 className='text-center' style={{background: "yellow"}}>¡Averigua como se siente tu alrededor!</h1>
						
						</Col>
					</Row>
		
					<Container className="map">
						<div id="map" style={{ height: '500px', width: '100%', }}>
						</div>
					</Container>
				</Container>
			)
};

			
	// const { store, actions } = useContext(Context);
	// // const [users, setUsers] = useState([]);
	

	// console.log(store.location);	

	// 	useEffect(() => {
	// 	// actions.loadSomeData();
	// 	const map = L.map('map').setView([51.505, -0.09], 13);

	// 	const users = [
	// 		{
	// 			icon: L.icon({
	// 				iconUrl: customIconUrl,
	// 				iconSize: [40, 40],
	// 				iconAnchor: [20, 40]
	// 			}),
	// 			lat: 51.505,
	// 			long: -0.08,
	// 		}
	// 	]

	// 	// // Agregar marcador con ícono personalizado al mapa
	// 	users.map((user) => {
	// 		return L.marker([user.lat, user.long], { icon: user.icon }).bindPopup('Marcador con ícono personalizado').addTo(map)
	// 	});



	// 	// Agregar capa de azulejos (tiles) de OpenStreetMap al mapa
	// 	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	// 		attribution: '&copy; OpenStreetMap contributors'
	// 	}).addTo(map);

	// 	return () => {
	// 		// Limpiar mapa al desmontar el componente (opcional)
	// 		map.remove();
	// 	};
	// }, []);// Ejecutar solo una vez al montar el componente

	// useEffect(() => {
	// 	// actions.getAllLocations(); // Esta función debe estar disponible en actions
	//   }, []);
	// console.log(actions.getAllLocations());

	// useEffect(() => {
	// 	const { location } = store;

	// 	// Mapea las ubicaciones para crear un array de usuarios con los marcadores
	// 	const usersArray = location.map(loc => ({
	// 		icon: L.icon({
	// 			iconUrl: customIconUrl,
	// 			iconSize: [40, 40],
	// 			iconAnchor: [20, 40]
	// 		}),
	// 		lat: loc.latitude,
	// 		long: loc.longitude,
	// 		id: loc.id // Agrega un identificador único si es necesario
	// 	}));

	// 	setUsers(usersArray); // Actualiza el estado local con los usuarios generados
	// }, [store.location]); // Ejecuta este efecto cuando las ubicaciones en el contexto cambien



// 	return (

// 		<Container className="map-app">

// 			<Row>
//  				<Col>
// 					<h1 className='button1'>¿ Sabes que hay muchas personas que se sienten igual que tú ?</h1>
// 				</Col>
// 			</Row>
// 			<Row>
// 				<Col>
// 					<h1 className='text-center' style={{background: "yellow"}}>¡Averigua como se siente tu alrededor!</h1>
// 					<div>
//  						{/* <h2>Ubicaciones de Usuarios</h2> */}
//                          {/* <ul>
//  							{store.locations.map((location, index) => (
// // 								<li key={index}>
// // 									Latitud: {location.lat}, Longitud: {location.lng}
// // 								</li>
// // 							))}
// // 						</ul> */}
// 					</div>
//  				</Col>
//  			</Row>

//  			<Container className="map">
//  				<div id="map" style={{ height: '500px', width: '100%', }}>
// 				</div>
//  			</Container>
// 		</Container>

// );
// };


		// <div style={{ height: '400px', width: '100%' }}>
		// 	{/* Renderiza el mapa */}

		// 	<Container className="map-app">
 		// 	<Row>
		// 		<Col>
 		// 		</Col>
 		// 	</Row>
 		// 	<Row>
		// 		<Col>
		// 		<h1 className='text-center' style={{ background: "yellow" }}>¡Averigua como se siente tu alrededor!</h1>
		// 		<div>
 		// 			  <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
		// 						{/* Agregar la capa de azulejos (tiles) de OpenStreetMap */}
		// 						<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

		// 						{/* Mapea sobre la lista de usuarios para renderizar los marcadores */}
		// 						{users.map(user => (
		// 							<Marker key={user.id} position={[user.lat, user.long]} icon={user.icon}>
		// 								{/* Agrega un popup opcional con información adicional */}
		// 								<Popup>
		// 									<div>
		// 										<h3>Usuario ID: {user.id}</h3>
		// 										<p>Latitud: {user.lat}</p>
		// 										<p>Longitud: {user.long}</p>
		// 									</div>
		// 								</Popup>
		// 							</Marker>
		// 						))}
		// 					</MapContainer>
 		// 			</div>
 		// 		</Col>
 		// 	</Row>

 		// 	<Container className="map">
 		// 		<div id="map" style={{ height: '500px', width: '100%', }}>
 		// 		</div>
 		// 	</Container>
 		// </Container>

		// </div>



// 	const { store, actions } = useContext(Context);


// 	useEffect(() => {
// 		// actions.loadSomeData();
// 		const map = L.map('map').setView([51.505, -0.09], 13);

// 		const users = [
// 			{
// 				icon: L.icon({
// 					iconUrl: customIconUrl,
// 					iconSize: [40, 40],
// 					iconAnchor: [20, 40]
// 				}),
// 				lat: 51.505,
// 				long: -0.08,
// 			}
// 		]

// 		// // Agregar marcador con ícono personalizado al mapa
// 		users.map((user) => {
// 			return L.marker([user.lat, user.long], { icon: user.icon }).bindPopup('Marcador con ícono personalizado').addTo(map)
// 		});



// 		// Agregar capa de azulejos (tiles) de OpenStreetMap al mapa
// 		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
// 			attribution: '&copy; OpenStreetMap contributors'
// 		}).addTo(map);

// 		return () => {
// 			// Limpiar mapa al desmontar el componente (opcional)
// 			map.remove();
// 		};
// 	}, []); // Ejecutar solo una vez al montar el componente

// 	return (
// 		<Container className="map-app">

// 			<Row>
// 				<Col>
// 					<h1 className='button1'>¿ Sabes que hay muchas personas que se sienten igual que tú ?</h1>
// 				</Col>
// 			</Row>
// 			<Row>
// 				<Col>
// 					<h1 className='text-center' style={{background: "yellow"}}>¡Averigua como se siente tu alrededor!</h1>
// 					<div>
// 						{/* <h2>Ubicaciones de Usuarios</h2> */}
//                         {/* <ul>
// 							{store.locations.map((location, index) => (
// 								<li key={index}>
// 									Latitud: {location.lat}, Longitud: {location.lng}
// 								</li>
// 							))}
// 						</ul> */}
// 					</div>
// 				</Col>
// 			</Row>

// 			<Container className="map">
// 				<div id="map" style={{ height: '500px', width: '100%', }}>
// 				</div>
// 			</Container>
// 		</Container>
// 	)
// };




// localizacion tiempo real

// useEffect(() => {
	//   const map = L.map('map').setView([51.505, -0.09], 13);
  
	//   // Agregar capa de azulejos (tiles) de OpenStreetMap al mapa
	//   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	// 	attribution: '&copy; OpenStreetMap contributors'
	//   }).addTo(map);
  
	//   let marker;
  
	//   const getLocation = () => {
	// 	if (navigator.geolocation) {
	// 	  navigator.geolocation.getCurrentPosition(
	// 		(position) => {
	// 		  const { latitude, longitude } = position.coords;
	// 		  updateMarkerLocation(latitude, longitude);
	// 		},
	// 		(error) => {
	// 		  console.error('Error al obtener la ubicación:', error);
	// 		}
	// 	  );
	// 	} else {
	// 	  console.error('Geolocalización no es compatible con este navegador.');
	// 	}
	//   };
  
	//   const updateMarkerLocation = (latitude, longitude) => {
	// 	if (marker) {
	// 	  map.removeLayer(marker);
	// 	}
  
	// 	marker = L.marker([latitude, longitude], {
	// 	  icon: L.icon({
	// 		iconUrl: customIconUrl,
	// 		iconSize: [120, 20],
	// 		iconAnchor: [20, 40]
	// 	  })
	// 	}).addTo(map);
  
	// 	map.setView([latitude, longitude], 13); // Centrar el mapa en la nueva ubicación
	//   };
  
	//   getLocation();
  
	//   const interval = setInterval(() => {
	// 	getLocation();
	//   }, 60000);
  
	//   return () => {
	// 	clearInterval(interval);
	//   };
	// }, []);