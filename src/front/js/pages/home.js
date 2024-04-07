import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";


export const Home = () => {
	const { store, actions } = useContext(Context);

	function handleCallbackResponse(response) {
		console.log("Encoded JWT ID token: " + response.credential);
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
			client_id: "364011413939-4bmaa89l50nceb4c0cgapc2vsn5qh0p2.apps.googleusercontent.com",
			callback: handleCallbackResponse

		})
		google.accounts.id.renderButton(
			document.getElementById("signInDiv"),
			{ theme: "outline", size: "large" }
		)
	}, []);

	return (
		<div className="text-center mt-5">
			<h1>Welcome to Mymood</h1>

			<div id="signInDiv"></div>
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
