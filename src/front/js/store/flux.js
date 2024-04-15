const getState = ({ getStore, getActions, setStore }) => {
	return {


		store: {
			message: null,
			
			user: null,
			
			location: [],
		},


		actions: {
			//mymood
			setUser: (user) => {
				setStore({ user: user });
			},
			clearUser: () => {
				setStore({ user: null });
			},	

			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},


			saveUserLocation: async () => {
				try {
					if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(async (position) => {
							const { latitude, longitude } = position.coords;
			
							// Verificar si la ubicación ya existe antes de guardarla
							const existingLocation = store.location.results.find(loc => loc.latitude === latitude && loc.longitude === longitude);
							if (existingLocation) {
								console.log('La ubicación ya existe en la base de datos');
								return; // No guardar la ubicación nuevamente
							}
			
							// Hacer una solicitud POST a la API para guardar la ubicación del usuario
							const response = await fetch('https://cuddly-happiness-7vvvx7wrjp64hppg-3001.app.github.dev/api/location', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json'
								},
								body: JSON.stringify({ latitude, longitude })
							});
			
							if (response.ok) {
								console.log('Ubicación guardada exitosamente');
							} else {
								console.error('Error al guardar la ubicación:', response.statusText);
							}
						}, (error) => {
							console.error('Error al obtener la ubicación:', error.message);
						});
					} else {
						console.error('Geolocalización no es compatible con este navegador.');
					}
				} catch (error) {
					console.error('Error al guardar la ubicación:', error);
				}
			},
			
			// saveUserLocation: async () => {
			// 	try {
			// 		if (navigator.geolocation) {
			// 			navigator.geolocation.getCurrentPosition(async (position) => {
			// 				const { latitude, longitude } = position.coords;
			
			// 				// Hacer una solicitud POST a la API para guardar la ubicación del usuario
			// 				const response = await fetch('https://cuddly-happiness-7vvvx7wrjp64hppg-3001.app.github.dev/api/location', {
			// 					method: 'POST',
			// 					headers: {
			// 						'Content-Type': 'application/json'
			// 					},
			// 					body: JSON.stringify({ latitude, longitude })
			// 				});
			
			// 				if (response.ok) {
			// 					console.log('Ubicación guardada exitosamente');
								
			// 					// Desencadenar una actualización del mapa después de guardar la ubicación
			// 					updateMap();
			// 				} else {
			// 					console.error('Error al guardar la ubicación:', response.statusText);
			// 				}
			// 			}, (error) => {
			// 				console.error('Error al obtener la ubicación:', error.message);
			// 			});
			// 		} else {
			// 			console.error('Geolocalización no es compatible con este navegador.');
			// 		}
			// 	} catch (error) {
			// 		console.error('Error al guardar la ubicación:', error);
			// 	}
			// },



			  getAllLocations: async () => {
				try {
					const storedDataLocation = sessionStorage.getItem("locationData");
			
					if (storedDataLocation) {
						// Si hay datos almacenados en sessionStorage, usa esos datos
						setStore && setStore({ location: JSON.parse(storedDataLocation) });
						console.log("Ubicaciones cargadas desde sessionStorage.");
					} else {
						// Si no hay datos almacenados, realiza una solicitud GET para obtener las ubicaciones
						const urlLocation = `https://cuddly-happiness-7vvvx7wrjp64hppg-3001.app.github.dev/api/location/`;
						const response = await fetch(urlLocation, {
							method: 'GET'
						});
			
						if (!response.ok) {
							throw new Error(`Failed to fetch location data: ${response.status} ${response.statusText}`);
						}
			
						const locationsData = await response.json();
			
						// Actualiza el estado con las ubicaciones obtenidas
						setStore && setStore({ location: locationsData });
						console.log("Ubicaciones cargadas desde la API.");
			
						// Guarda las ubicaciones en sessionStorage para futuros accesos
						sessionStorage.setItem("locationData", JSON.stringify(locationsData));
					}
					return true;
				} catch (error) {
					console.error('Error fetching or processing location data:', error);
					return false;
				}
			},

			// getAllLocations: async () => {
			// 	try {
			// 		const storedDataLocation = sessionStorage.getItem("locationData");
			
			// 		if (storedDataLocation) {
			// 			// Si hay datos almacenados en sessionStorage, usa esos datos
			// 			setStore({ location: JSON.parse(storedDataLocation) });
			// 		} else {
			// 			// Si no hay datos almacenados, realiza una solicitud GET para obtener las ubicaciones
			// 			const urlLocation = `https://cuddly-happiness-7vvvx7wrjp64hppg-3001.app.github.dev/api/location/`;
			// 			const response = await fetch(urlLocation, {
			// 				method: 'GET'	
			// 			});
			
			// 			if (!response.ok) {
			// 				throw new Error(`Failed to fetch location data: ${response.status} ${response.statusText}`);
			// 			}
			
			// 			const locationsData = await response.json();
			
			// 			// Actualiza el estado con las ubicaciones obtenidas
			// 			setStore && setStore({ location: locationsData });
			// 			console.log(locationsData);
			// 			return true;
			// 			// Guarda las ubicaciones en sessionStorage para futuros accesos
			// 			sessionStorage.setItem("locationData", JSON.stringify(locationsData));
			// 		// }
			// 	} catch (error) {
			// 		console.error('Error fetching or processing location data:', error);
			// 		return false;
			// 	}	
			
			// },
			
			
			
			  
			

			// getMessage: async () => {
			// 	try{
			// 		// fetching data from the backend
			// 		const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
			// 		const data = await resp.json()
			// 		setStore({ message: data.message })
			// 		// don't forget to return something, that is how the async resolves
			// 		return data;
			// 	}catch(error){
			// 		console.log("Error loading message from backend", error)
			// 	}
			// },
			
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
