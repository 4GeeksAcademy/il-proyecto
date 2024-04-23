import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { Container, Row, Col } from 'react-bootstrap';
import MapComponent from '../component/map';

export const Geolocation = () => {
	
  return (	
    	<Container fluid className="map-page">
			<Row>
				<Col>
					<h1 className='button1'>¿ Sabes que hay muchas personas que se sienten igual que tú ?</h1>
				</Col>
			</Row>
			<Row>
				<Col>
					<h1 className='text-center map-heading'>¡Averigua como se siente tu alrededor!</h1>
				</Col>
			</Row>
			<Container fluid className="map">
				<MapComponent />
			</Container>
        </Container>
  );
};

export default Geolocation;


