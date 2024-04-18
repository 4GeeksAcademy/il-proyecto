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


			login: async (email, password) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							"email": email,
							"password": password
						})
					})
					const data = await response.json();
					if (response.status !== 200) {
						console.log("Login error:", response.status, data.msg);
						return false;
					}
					sessionStorage.setItem("userToken", data.access_token);
					getActions().setUser(data.user);
					return true;
				}
				catch (error) {
					console.log("Error en login:", error);
					return false;
				}
			},

			loginGoogle: async (response) => {
				console.log(response);
				const tokenId = response.credential;
				const result = await fetch(`${process.env.BACKEND_URL}/api/login-google`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id_token: tokenId })
				});

				const data = await result.json();
				if (result.ok) {
					// Procesa el login exitoso
					console.log("Login successful:", data);
					sessionStorage.setItem('userToken', data.access_token);
					console.log(data.user);
					getActions().setUser(data.user);
					return true;
				} else {
					console.error("Login failed:", data.message);
					return false;
				}
			},


			logout: async () => {
				console.log("Entramos hacer el logout.....");
				const actions = getActions();
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/logout', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + sessionStorage.getItem("userToken")
						}
					});
					if (response.ok) {
						sessionStorage.removeItem("userToken");
						actions.clearUser();
					} else {
						throw new Error('Logout failed');
					}
				} catch (error) {
					console.error('Logout error:', error);
				}
			},


			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},


			saveUserLocation: async (latitude, longitude) => {
				try {
					const store = getStore(); // Obtener el estado actual (store)
		
					// Si la ubicación no existe en la base de datos, procede con la inserción
					const url = `${process.env.BACKEND_URL}/api/location`;
					const locationData = { latitude, longitude };

					const response = await fetch(url, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(locationData)
					});

					// Esperar la respuesta del servidor antes de continuar
					const responseData = await response.json();

					// Verificar si la respuesta es exitosa (código de estado 200-299)
					if (response.ok) {
						// Actualizar el estado global solo si la ubicación no existe previamente
						setStore(prevState => ({
							...prevState,
							location: [...prevState.location, locationData] // Agregar la nueva ubicación al estado
						}));

						console.log('Location saved successfully');
						return true;
					} else {
						throw new Error(`Error saving location: ${response.statusText}`);
					}
				} catch (error) {
					console.error('Error saving location:', error.message);
					return false;
				}
			},


			// saveUserLocation: async (latitude, longitude) => {
			// 	try {
			// 		const store = getStore(); // Obtener el estado actual (store)

			// 		// Verificar si el estado y la propiedad location están definidos
			// 		if (!store || !store.location) {
			// 			console.error('Store or location property is undefined.');
			// 			return false;
			// 		}

			// 		// Verificar si la ubicación ya existe en el estado antes de guardarla
			// 		// const existingLocation = store.location.find(loc => loc.latitude === latitude && loc.longitude === longitude);
			// 		// if (existingLocation) {
			// 		// console.log('The location already exists in the database.');
			// 		// return false; // No guardar la ubicación nuevamente
			// 		// }
			// 		// Verificar si la ubicación ya existe en el estado antes de guardarla
			// 		const exists = store.location.some(loc => loc.results.latitude === latitude && loc.results.longitude === longitude);
			// 		if (exists) {
			// 			console.log('The location already exists in the database.');
			// 			return false; // No guardar la ubicación nuevamente
			// 		}


			// 		// Construir la URL de la API para guardar la ubicación del usuario
			// 		const url = `${process.env.BACKEND_URL}/api/location`;

			// 		// Datos de ubicación a enviar en la solicitud POST
			// 		const locationData = {
			// 			latitude,
			// 			longitude
			// 		};

			// 		// Realizar la solicitud POST a la API utilizando fetch y esperar la respuesta
			// 		const response = await fetch(url, {
			// 			method: 'POST',
			// 			headers: {
			// 				'Content-Type': 'application/json'
			// 			},
			// 			body: JSON.stringify(locationData) // Convertir los datos a formato JSON
			// 		});

			// 		// Esperar la respuesta del servidor antes de continuar
			// 		const responseData = await response.json();

			// 		// Verificar si la respuesta es exitosa (código de estado 200-299)
			// 		if (response.ok) {
			// 			// Actualizar el estado global solo si la ubicación no existe previamente
			// 			setStore(prevState => ({
			// 				...prevState,
			// 				location: [...prevState.location, locationData] // Agregar la nueva ubicación al estado
			// 			}));

			// 			console.log('Location saved successfully');
			// 			return true; // Indicar que la ubicación se guardó con éxito
			// 		} else {
			// 			// Manejar errores si la solicitud no fue exitosa
			// 			throw new Error(`Error saving location: ${responseData.message || response.statusText}`);
			// 		}
			// 	} catch (error) {
			// 		console.error('Error saving location:', error.message);
			// 		return false; // Indicar que hubo un error al guardar la ubicación
			// 	}
			// },



			// saveUserLocation: async (latitude, longitude) => {
			// 	try {
			// 	  // Construir la URL de la API para guardar la ubicación del usuario
			// 	  const url = `${process.env.BACKEND_URL}/api/location`;

			// 	  // Datos de ubicación a enviar en la solicitud POST
			// 	  const locationData = {
			// 		latitude,
			// 		longitude
			// 	  };

			// 	//   Verificar si la ubicación ya existe antes de guardarla
			// 		const existingLocation = getStore(store.location.results.find(loc => loc.latitude === latitude && loc.longitude === longitude));
			// 		if (existingLocation) {
			// 			console.log('The location already exists in the database.');
			// 			return false; // No guardar la ubicación nuevamente
			// 		}

			// 	  // Realizar la solicitud POST a la API utilizando fetch
			// 	  const response = await fetch(url, {
			// 		method: 'POST',
			// 		headers: {
			// 		  'Content-Type': 'application/json'
			// 		},
			// 		body: JSON.stringify(locationData) // Convertir los datos a formato JSON
			// 	  });

			// 	  // Verificar si la respuesta es exitosa (código de estado 200-299)
			// 	  if (response.ok) {
			// 		setStore && setStore({ location: locationData });
			// 		console.log('Location saved successfully');
			// 		// Aquí puedes realizar otras acciones después de guardar la ubicación
			// 	  } else {
			// 		// Manejar errores si la solicitud no fue exitosa
			// 		throw new Error(`Error saving location: ${response.statusText}`);
			// 	  }
			// 	} catch (error) {
			// 	  console.error('Error saving location:', error.message);
			// 	  // Manejar errores de manera apropiada en tu aplicación
			// 	}
			//   },



			getAllLocations: async () => {
				try {
					// Realiza una solicitud GET para obtener las ubicaciones
					const urlLocation = process.env.BACKEND_URL + `/api/location`;
					const response = await fetch(urlLocation, {
						method: 'GET'
					});

					if (!response.ok) {
						throw new Error(`Failed to fetch location data: ${response.status} ${response.statusText}`);
					}

					const locationsData = await response.json();

					// Actualiza el estado con las ubicaciones obtenidas
					setStore && setStore({ location: locationsData });
					console.log("Locations loaded from the API.");

					return true;
				} catch (error) {
					console.error('Error fetching or processing location data:', error);
					return false;
				}
			},


			//   getAllLocations: async () => {
			// 	try {
			// 		const storedDataLocation = sessionStorage.getItem("locationData");

			// 		if (storedDataLocation) {
			// 			// Si hay datos almacenados en sessionStorage, usa esos datos
			// 			setStore && setStore({ location: JSON.parse(storedDataLocation) });
			// 			console.log("Locations loaded from sessionStorage.");
			// 		} else {
			// 			// Si no hay datos almacenados, realiza una solicitud GET para obtener las ubicaciones
			// 			const urlLocation = process.env.BACKEND_URL + `/api/location`;
			// 			const response = await fetch(urlLocation, {
			// 				method: 'GET'
			// 			});

			// 			if (!response.ok) {
			// 				throw new Error(`Failed to fetch location data: ${response.status} ${response.statusText}`);
			// 			}

			// 			const locationsData = await response.json();

			// 			// Actualiza el estado con las ubicaciones obtenidas
			// 			setStore && setStore({ location: locationsData });
			// 			console.log("Locations loaded from the API.");

			// 			// Guarda las ubicaciones en sessionStorage para futuros accesos
			// 			sessionStorage.setItem("locationData", JSON.stringify(locationsData));
			// 		}
			// 		return true;
			// 	} catch (error) {
			// 		console.error('Error fetching or processing location data:', error);
			// 		return false;
			// 	}
			// },





			clearUserLocation: () => {
				return async (dispatch, getState) => {
					try {
						const { user } = getState(); // Obtener el usuario actual del estado global
						const userId = user.id;

						// Realizar una solicitud al servidor para eliminar la ubicación del usuario
						const response = await fetch(process.env.BACKEND_URL + `users/${userId}/location`, {
							method: 'DELETE',
							headers: {
								'Content-Type': 'application/json',
								// Puedes incluir otros encabezados necesarios aquí (por ejemplo, token de autenticación)
							},
						});

						if (!response.ok) {
							throw new Error('Error al eliminar la ubicación del usuario');
						}

						// Despachar una acción para limpiar la ubicación del usuario en el estado global (store)
						dispatch({ type: 'CLEAR_USER_LOCATION' });
					} catch (error) {
						console.error('Error al eliminar la ubicación del usuario:', error.message);
						// Puedes manejar errores o mostrar mensajes de error aquí
					}
				};
			},

		}
	};
};

export default getState;
