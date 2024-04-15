import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
// import Context from '../store/appContext';
import MapComponent from '../component/Map';


export const Geolocation = () => {

	// const { store, actions } = useContext(Context);


	return (
				<Container fluid className="map-app">
		
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
		
					<Container fluid className="map">
						<MapComponent />
					</Container>
				</Container>
			)
};

			
// const { store, actions } = useContext(Context);

// 		useEffect(() => { actions.getAllLocations(), actions.saveUserLocation();}, []);

// 	console.log(store.location);

	


// 	useEffect(() => {
// 		const map = L.map('map').setView([51.505, -0.09], 3); // Ajusta el nivel de zoom según tus necesidades
	
// 		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
// 			attribution: '&copy; OpenStreetMap contributors'
// 		}).addTo(map);
	
// 		// Conjunto para mantener IDs de ubicaciones agregadas al mapa
// 		const addedLocationIds = new Set();
	
// 		if (store.location && Array.isArray(store.location.results)) {
// 			store.location.results.forEach((location) => {
// 				const { id, latitude, longitude } = location;
	
// 				// Verificar si el ID de la ubicación ya fue agregado al mapa
// 				if (!addedLocationIds.has(id)) {
// 					const customIcon = L.icon({
// 						iconUrl: customIconUrl, // Reemplazar con la URL de tu ícono personalizado
// 						iconSize: [60, 20],
// 						iconAnchor: [20, 40]
// 					});
	
// 					L.marker([latitude, longitude], { icon: customIcon })
// 						.bindPopup(`Ubicación ${id}`)
// 						.addTo(map);
	
// 					// Agregar el ID de la ubicación al conjunto de IDs agregados
// 					addedLocationIds.add(id);
// 				}
// 			});
// 		}
	
// 		return () => {
// 			map.remove();
// 		};
// 	}, [store.location]);