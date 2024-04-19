import ResetPassword from "../component/resetPassword";

const getState = ({ getStore, getActions, setStore }) => {
	return {


		store: {
			message: null,

			user: null,

			location: [],
			
			auth: false,

		},


		actions: {
			//mymood
			setAuth: (auth) =>{
				setStore({ ...getStore(), auth: auth });
			},
			setUser: (user) => {
				setStore({ ...getStore(), user: user });
			},
			clearUser: () => {
				setStore({ ...getStore(), user: null });
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
					sessionStorage.setItem("userData", JSON.stringify(data.user));

					// getActions().setUser(data.user);
					console.log(data);
					setStore({ ...getStore(), user: data.user });
					setStore({ ...getStore(), auth: true })
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
					sessionStorage.setItem("userData", JSON.stringify(data.user));
					console.log(data.user);
					getActions().setUser(data.user);
					setStore({ ...getStore(), auth: true })
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
						sessionStorage.removeItem("userData");
						setStore({ ...getStore(), auth: false })
						actions.clearUser();
					} else {
						throw new Error('Logout failed');
					}
				} catch (error) {
					console.error('Logout error:', error);
				}
			},

			resetPassword: async (token, password) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/reset-password/${token}`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ password })
					});

					const data = await response.json(); 

					if (!response.ok) {
						let errorMessage = 'Hubo un error al restablecer la contraseña';
						if (response.status === 400) {
							errorMessage = 'La solicitud es incorrecta';
						} else if (response.status === 404) {
							errorMessage = 'No se encontró el recurso';
						}
						throw new Error(errorMessage);
					}
					return data; 
				} catch (error) {
					console.error("Error reset password:", error);
					return { ok: false, message: "Network error" };
				}
			},

			// resetPassword: async (token, password) => {
			// 	try {
			// 		const response = await fetch(`${process.env.BACKEND_URL}/api/reset-password/${token}`, {
			// 			method: 'POST',
			// 			headers: {
			// 				'Content-Type': 'application/json'
			// 			},
			// 			body: JSON.stringify({ password })
			// 		});

			// 		if (!response.ok) {
			// 			let errorMessage = 'Hubo un error al restablecer la contraseña';
			// 			if (response.status === 400) {
			// 				errorMessage = 'La solicitud es incorrecta';
			// 			} else if (response.status === 404) {
			// 				errorMessage = 'No se encontró el recurso';
			// 			}
			// 			throw new Error(errorMessage);
			// 		}
			// 		return response;
			// 	} catch (error) {
			// 		console.error("Error reset password:", error);
			// 		return { ok: false, message: "Network error" };
			// 	}
			// },

			signUp: async (name, surnames, email, password) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/signup`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							name,
							surnames,
							email,
							password
						})
					});
					const data = await response.json();
					if (response.ok) {
						setStore({ user: data.user });
						return { status: true, msg: "User created successfully." };
					} else {
						return { status: false, msg: data.msg };
					}
				} catch (error) {
					console.error("Error signing up:", error);
					return { status: false, msg: "Network error" };
				}
			},

			validToken: async () => {
				console.log("holaaaaa estooy en valid token");
				let token = sessionStorage.getItem("userToken");
				let user = JSON.parse(sessionStorage.getItem("userData"));

				if (!token) {
					console.log("Token not found");
					setStore({ ...getStore(), auth: false, user: null })
					return false;
				}
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/valid-token`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': "Bearer " + token,
						},
					});
					const data = await response.json();
					console.log(data);
					if (response.status === 200) {
						setStore({ ...getStore(), auth: data.is_logged, user: user })
						console.log('Login successful:', data);
						return true;
					}
					else {
						sessionStorage.removeItem("userToken");
						setStore({ ...getStore(), auth: false, user: null })
						return false;
					}
				} catch (error) {
					console.error('Token expired:', error);
					sessionStorage.removeItem("token");
					setStore({ ...getStore(), auth: false, user: null })
					return false;
				}
			},

			deleteAccount: async (user_id) => {
				console.log("Eliminar usuario....");
				console.log(user_id);
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/delete-account/${user_id}`, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
						},
					});
					const data = await response.json();
					
					if (response.ok) {
                        console.log("La cuenta se eliminó correctamente");
                        sessionStorage.removeItem("userToken");
                        sessionStorage.removeItem("userData");
                        getActions().clearUser(); // Acceso correcto a actions
                        setStore({ ...getStore(), auth: false, user: null });
                    } else {
                        console.log("Hubo un error al eliminar la cuenta:", data.error);
                    }
                } catch (error) {
                    console.log("Error deleting account from database", error);
                }
			},
			
			// Backend is running
			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			
			saveUserLocation: async (latitude, longitude) => {
				try {				
					// Obtener todas las ubicaciones existentes
					const getAllLocations = async () => {
						try {
							const urlLocation = `${process.env.BACKEND_URL}/api/location`;
							const response = await fetch(urlLocation, { method: 'GET' });
			
							if (!response.ok) {
								throw new Error(`Failed to fetch location data: ${response.status} ${response.statusText}`);
							}
			
							const data = await response.json();
							return data.results; // Devuelve solo la lista de ubicaciones
						} catch (error) {
							console.error('Error fetching location data:', error.message);
							return []; // Devuelve una lista vacía en caso de error
						}
					};
			
					// Obtener todas las ubicaciones
					const existingLocations = await getAllLocations();
			
					// Verificar si la ubicación ya existe en la lista de ubicaciones existentes
					const isDuplicate = existingLocations.some(loc => loc.latitude === latitude && loc.longitude === longitude);
			
					if (isDuplicate) {
						console.log('The location already exists in the database.');
						return false; // No guardar la ubicación nuevamente si ya existe
					}
			
					// Si la ubicación no existe, proceder con la solicitud POST para guardarla
					const postUrl = `${process.env.BACKEND_URL}/api/location`;
					const postResponse = await fetch(postUrl, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ latitude, longitude })
					});
			
					if (!postResponse.ok) {
						throw new Error(`Failed to save location: ${postResponse.status} ${postResponse.statusText}`);
					}
			
					// Actualizar el estado global con la nueva ubicación guardada
					const newLocation = { latitude, longitude };
					setStore(prevState => ({
						...prevState,
						location: [...prevState.location, newLocation]
					}));
			
					console.log('Location saved successfully');
					return true; // Indicar que la ubicación se guardó con éxito
				} catch (error) {
					console.error('Error saving location:', error.message);
					return false; // Indicar que hubo un error al guardar la ubicación
				}
			},




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

					const data = await response.json();

					// Actualiza el estado con las ubicaciones 
					console.log(data);
					setStore({ location: data });
					console.log("Locations loaded from the API to store.");

					return true;
				} catch (error) {
					console.error('Error fetching or processing location data:', error);
					return false;
				}
			},


			requestUserLocation: async () => {
				try {
					// obtener la ubicación del usuario
					const position = await new Promise((resolve, reject) => {
						navigator.geolocation.getCurrentPosition(resolve, reject);
					});
			
					//  latitud y longitud de la ubicación obtenida
					const latitude = position.coords.latitude;
					const longitude = position.coords.longitude;
			
					// ubicación en el estado global (store)
					getActions().saveUserLocation(latitude, longitude),
					getActions().getAllLocations(),
					setStore(prevState => ({
						...prevState,
						location: [{ latitude, longitude }]
						
					}));
					
				} catch (error) {
					console.error('Error getting user location:', error.message);
					
				}
			},
			


			// clearUserLocation: () => {
			// 	return async (dispatch, getState) => {
			// 		try {
			// 			const { user } = getState(); //  usuario actual del estado global
			// 			const userId = user.id;

			// 			// solicitud  para eliminar la ubicación del usuario
			// 			const response = await fetch(process.env.BACKEND_URL + `users/${userId}/location`, {
			// 				method: 'DELETE',
			// 				headers: {
			// 					'Content-Type': 'application/json',
			// 					// aqui token de autenticación
			// 				},
			// 			});

			// 			if (!response.ok) {
			// 				throw new Error('Error al eliminar la ubicación del usuario');
			// 			}

			// 			// Despachar una acción para limpiar la ubicación del usuario en el estado global (store)
			// 			dispatch({ type: 'CLEAR_USER_LOCATION' });
			// 		} catch (error) {
			// 			console.error('Error al eliminar la ubicación del usuario:', error.message);
			// 			
			// 		}
			// 	};
			// },

		}
	};
};

export default getState;
