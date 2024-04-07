import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

/* GOOGLE LOGIN */
import { jwtDecode } from "jwt-decode";


export const Home = () => {
	const [user, setUser] = useState({});

	const { store, actions } = useContext(Context);

	function handleCallbackResponse(response) {
		console.log("Encoded JWT ID token: " + response.credential);
		var userObject = jwtDecode(response.credential);
		console.log(userObject);
		setUser(userObject);
		document.getElementById("signInDiv").hidden = true;
	}

	function handleSingOut(event) {
		setUser({});
		document.getElementById("signInDiv").hidden = false;

	}

	useEffect(() => {

		const isApiScriptLoaded = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');

		if (!isApiScriptLoaded) {
			// Crea un nuevo elemento script
			const script = document.createElement('script');
			script.src = "https://accounts.google.com/gsi/client";
			script.async = true;
			script.defer = true;
			script.onload = () => {
				// El script se ha cargado y está listo para usar
				console.log("Google API script loaded successfully.");
				// Aquí puedes inicializar o ejecutar tu lógica relacionada con la API de Google
			};
			script.onerror = () => {
				console.error("Error loading the Google API script.");
			};
			// Añade el script al documento
			document.body.appendChild(script);
		}

		/* global google */
		google.accounts.id.initialize({
			client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
			callback: handleCallbackResponse

		})

		google.accounts.id.renderButton(
			document.getElementById("signInDiv"),
			{ theme: "outline", size: "large" }
		);

	}, []);

	//If we have no user: sign in button 
	//If we have a user: show the log out button 

	return (
		<div className="text-center mt-5">
			<h1>Welcome to Mymood</h1>

			<div id="signInDiv"></div>
			{
				Object.keys(user).length != 0 &&
				<button onClick={(e) => handleSingOut(e)}>Sing Out</button>
			}
			{user &&
				<div>
					<img src={user.picture} />
					<h3>{user.name}</h3>
				</div>
			}
			<p>
				<img src={rigoImageUrl} />
			</p>
			<div className="alert alert-info">
				{store.message || "Loading message from the backend (make sure your python backend is running)..."}
			</div>
			<p>
				This boilerplate comes with lots of documentation:{" "}
				<a href="https://start.4geeksacademy.com/starters/react-flask">
					Read documentation
				</a>
			</p>
		</div>
	);
};
