import React, { useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

/* React Bootstrap */
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

/* App */
import logo from "../../img/logo.png";

export const MainNavbar = () => {
    const { store, actions } = useContext(Context);
	const navigate = useNavigate();

    const handleLogout = () => {
        actions.logout();
		navigate("/");
    };

    return (
        <Navbar className="bg-body-white" >
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
                    <Nav>
                        {store?.auth ? (
                            <>
                                <Navbar.Text className="text-body">Hola, <b>{store.user ? store.user?.name : ""}</b></Navbar.Text>
                                <Button variant="link" className="text-black-50 text-decoration-none" onClick={handleLogout}>Cerrar sesión</Button>
                                <NavDropdown title="Menu" id="basic-nav-dropdown" align="end" >
                                    <NavDropdown.Item href="/geolocation">Mapa</NavDropdown.Item>
                                    <NavDropdown.Item href="/resources">Recursos</NavDropdown.Item>
                                    <NavDropdown.Item href={`/${store.user?.id}/${store.user?.profile_url}`}>Perfil</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="/choose-mood">Mood</NavDropdown.Item>
                                    <NavDropdown.Item href="/chat-v1">Chat</NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ) : (
                            <Nav.Link href="/login" className="text-black">Iniciar sesión</Nav.Link>
                        )}

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

