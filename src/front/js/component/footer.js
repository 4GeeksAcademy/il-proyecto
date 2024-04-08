import React, { Component } from "react";

/* React boostrap */
import Container from 'react-bootstrap/Container';

export const Footer = () => (
	<Container fluid>
		<footer className="footer mt-auto py-3">
		<p>
			Mymood <i className="fa-regular fa-copyright" /> 2024. {" "}
			<a href="http://www.4geeksacademy.com">4Geeks Academy</a>
		</p>
	</footer>
	</Container>
	
);
