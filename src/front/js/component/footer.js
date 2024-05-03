import React, { Component } from "react";

/* React boostrap */
import { Container, Row, Col } from 'react-bootstrap';
import logo from "../../img/logo.png";

export const Footer = () => (
	<>
		<footer className="mt-3 mb-3 py-3 container-landingpage footer-container">
			<Container fluid className="">
				<Row>
					<Col>
						<div>
							<img src={logo} width="150" height="auto" />
						</div>
						<div>
							<ul className="social">
								<li><a href="/">in.</a></li>
								<li><a href="/">fb.</a></li>
								<li><a href="/">tw.</a></li>
								<li><a href="/">li.</a></li>
							</ul>

						</div>

					</Col>
					<Col>
						<ul>
							<li>Comienza tu viaje</li>
							<li><a href="/">¿Qué es My Mood?</a></li>
							<li><a href="/faqs">Preguntas frecuentes</a></li>
							<li><a href="/team">Open Source</a></li>
						</ul>
					</Col>
					<Col>
						<ul>
							<li>Perfil</li>
							<li><a href="/login">Login</a></li>
							<li><a href="/singup">Registrarse</a></li>
							<li><a href="/delete-account">Dar de baja la cuenta</a></li>
						</ul>
					</Col>
					<Col>
						<ul>
							<li>Legal</li>
							<li><a href="/legal#legal">Aviso legal</a></li>
							<li><a href="/legal#policy">Política de privacidad</a></li>
							<li><a href="/legal#cookies">Política de cookies</a></li>
						</ul>
					</Col>
				</Row>
				<Row className="mt-4 mb-0">
					<Col className="copyright">
						<p>
							Mymood <i className="fa-regular fa-copyright" /> 2024. {" "}
							<a href="http://www.4geeksacademy.com">4Geeks Academy</a>
						</p>
					</Col>
				</Row>
			</Container>
		</footer>
	</>

);
