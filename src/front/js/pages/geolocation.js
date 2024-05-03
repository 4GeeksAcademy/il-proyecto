import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { Container, Row, Col } from 'react-bootstrap';
import MapComponent from '../component/map';

export const Geolocation = () => {


	return (
		<Container fluid className="map-page">
			<Row>
				<Col>
					<h4 className='orange-box'>¿ Sabes que hay muchas personas que se sienten igual que tú ?</h4>
				</Col>
			</Row>
			<Row>
				<Col className='text-center'>
				<h1 className='font-weight-bold'>¡Echemos un vistazo!</h1>
				</Col>
			</Row>
			<Container fluid className="map">
				<MapComponent />
			</Container>
		</Container>
	);
};

export default Geolocation;


