import React, { Component } from "react";

/* React boostrap */
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

/* App */
import logo from "../../img/logo.png";

export const Footer = () => (
	<Container fluid>
		<footer className="footer mt-auto py-3">
			<Row>
				<img
					src={logo}
					width='120'
					height="auto"
					className="d-inline-block align-top"
					alt="Mymood logo"
					style={{ width: '150px' }}
				/>

			</Row>
			<Row>
				<Col>
					<div>
						<a href="#">in.</a>{" "}<a href="#">fb.</a>{" "}<a href="#">tw.</a>{" "}<a href="#">li.</a>
					</div>
				</Col>
				<Col>
					<p>Comienza tu viaje</p>
					<ul>
						<li><a>Qué es Mymood</a></li>
						<li><a>Preguntas frecuentes</a></li>
						<li><a>Open Source</a></li>
					</ul>

				</Col>
				<Col>
					<p>Perfil</p>
					<ul>
						<li><a>Login</a></li>
						<li><a>Registrarse</a></li>
						<li><a>Darse de baja</a></li>
					</ul>

				</Col>
				<Col>
					<p>Legal</p>
					<ul>
						<li><a>Aviso legal</a></li>
						<li><a>Política de privacidad</a></li>
						<li><a>Política de cookies</a></li>
					</ul>

				</Col>
			</Row>
			<Row>
				<p>Mymood <i className="fa-regular fa-copyright" /> 2024. {" "}<a href="http://www.4geeksacademy.com">4Geeks Academy</a></p>
			</Row>
		</footer>
	</Container>
);
