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

		}
	};
};

export default getState;
