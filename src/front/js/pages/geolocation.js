import React, { useState, useEffect, useContext } from "react";
import Context from '../store/appContext';
import PropTypes from "prop-types";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import customIconUrl from '../../img/logo.png';
import { Container, Row, Col } from 'react-bootstrap';
import "../../styles/map.css";



export const Geolocation = () => {

	// const { store, actions } = useContext(Context);

	useEffect(() => {
		// actions.loadSomeData();
		const map = L.map('map').setView([51.505, -0.09], 13);

		const users = [
			{
				icon: L.icon({
					iconUrl: customIconUrl,
					iconSize: [40, 40],
					iconAnchor: [20, 40]
				}),
				lat: 51.505,
				long: -0.08,
			},

			{
				icon: L.icon({
					iconUrl: customIconUrl,
					iconSize: [40, 40],
					iconAnchor: [20, 40]
				}),
				lat: 51.405,
				long: -0.07,
			},

			{
				icon: L.icon({
					iconUrl: customIconUrl,
					iconSize: [40, 40],
					iconAnchor: [20, 40]
				}),
				lat: 51.305,
				long: -0.07,
			}
		]

		// // Agregar marcador con ícono personalizado al mapa
		users.map((user) => {
			return L.marker([user.lat, user.long], { icon: user.icon }).bindPopup('Marcador con ícono personalizado').addTo(map)
		});



		// Agregar capa de azulejos (tiles) de OpenStreetMap al mapa
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; OpenStreetMap contributors'
		}).addTo(map);

		return () => {
			// Limpiar mapa al desmontar el componente (opcional)
			map.remove();
		};
	}, []); // Ejecutar solo una vez al montar el componente

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
					<div>
						{/* <h2>Ubicaciones de Usuarios</h2> */}
                        {/* <ul>
							{store.locations.map((location, index) => (
								<li key={index}>
									Latitud: {location.lat}, Longitud: {location.lng}
								</li>
							))}
						</ul> */}
					</div>
				</Col>
			</Row>

			<Container className="map">
				<div id="map" style={{ height: '500px', width: '100%', }}>
				</div>
			</Container>
		</Container>
	)
};


export default Geolocation;