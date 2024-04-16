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
								<>
									<Image src={store.user.picture} width="22" height="22" alt="User" roundedCircle style={{ margin: '8px 5px' }} />
									<Navbar.Text>Hola, {store.user.name}</Navbar.Text>
									<button onClick={() => actions.logout()} href="/"> (Cerrar sesión) </button>
								</>
							) : (
								<Nav.Link href="/login" className="text-black">Iniciar sesión</Nav.Link>
							)
						}
						<NavDropdown title="Menu" id="basic-nav-dropdown">
							<NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
							<NavDropdown.Item href="#action/3.2">
								Another action
							</NavDropdown.Item>
							<NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item href="#action/3.4">
								Link
							</NavDropdown.Item>
						</NavDropdown>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};
