import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Nav, NavDropdown, Navbar, Container } from "react-bootstrap";
import "../../styles/mainNavbar.css";
import logo from "../../img/logo.png";

export const MainNavbar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleLogout = () => {
        actions.logout();
        navigate("/");
    };

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
                    <Nav className="navbar-nav">
                        {sessionStorage.getItem('userToken') ? (
                            <>
                                <Navbar.Text className="text-body">Hola, <b>{JSON.parse(sessionStorage.getItem('userData')).name}</b></Navbar.Text>
                                <NavDropdown
                                    className="button-login custom-nav-dropdown" // Agrega las clases personalizadas
                                    title="Menu"
                                    id="basic-nav-dropdown"
                                    align="end"
                                >
                                    <NavDropdown.Item href="/choose-mood" className="nav-item">Mood</NavDropdown.Item>
                                    <NavDropdown.Item href="/geolocation" className="nav-item">Mapa</NavDropdown.Item>
                                    <NavDropdown.Item href="/resources" className="nav-item">Recursos</NavDropdown.Item>
                                    <NavDropdown.Item href="/psychologist" className="nav-item">Terapeutas</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href={`/${store.user?.id}/${store.user?.profile_url}`} className="nav-item">Perfil</NavDropdown.Item>
                                    <NavDropdown.Item href="#" onClick={handleLogout} className="nav-item">Cerrar sesión</NavDropdown.Item>
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
