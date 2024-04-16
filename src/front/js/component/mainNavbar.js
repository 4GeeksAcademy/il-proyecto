import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

/* React Boostrap */
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

/* App */
import logo from "../../img/logo.png";


export const MainNavbar = () => {

	const { store, actions } = useContext(Context);

	return (

		<Navbar className="bg-body-white">
			<Container fluid>
				<Navbar.Brand href="/" className="d-flex">
					<img
						src={logo}
						width="150px"
						height="auto"
						className="d-inline-block align-top"
						alt="Mymood logo"
					/>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
					<Nav >
					{ 
						
						store.user ? (

					<NavDropdown title="Menu" id="basic-nav-dropdown">
						<NavDropdown.Item href="/geolocation">Mi alrededor</NavDropdown.Item>
						<NavDropdown.Item href="#action/3.2">
							Another action
						</NavDropdown.Item>
						<NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
						<NavDropdown.Divider />
						<NavDropdown.Item href="#action/3.4">
							Link
						</NavDropdown.Item>
						
					</NavDropdown>) : ( null ) }

						{
							store.user ? (
								<>
									<Image src={store.user.picture} width="22" height="22" alt="User" roundedCircle style={{ margin: '8px 5px' }} />
									<Navbar.Text>Hola, {store.user.name}</Navbar.Text>
									<button className="button-login" onClick={() => actions.logout()} href="/"> Cerrar sesión </button>
								</>
							) : (
								<>
								<Link to="/login">
								<button className="button-login">Iniciar sesión</button>
								</Link>
								
								{/* // <Nav.Link href="/login" className="text-black">Iniciar sesión</Nav.Link> */}
								</>
							)
						}
						
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};
