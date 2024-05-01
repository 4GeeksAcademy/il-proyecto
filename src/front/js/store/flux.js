import { socket } from "./appContext";

const getState = ({ getStore, getActions, setStore }) => {
	return {

		store: {
			message: null,

			user: null,

			active_users: [],

			all_users: [],

			auth: false,

			resources: [],

			mood: [],

			room: null,

			allPsychologist: [],
			psychologist_info: {},
			psychologist_resources: [],

		},

		// socket:{},

		actions: {
			//mymood
			setAuth: (auth) => {
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
					sessionStorage.setItem("userData", JSON.stringify({ id: data.user.id, name: data.user.name, surnames: data.user.surnames }));

					console.log(data);
					getActions().getCurrentUser();
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
					sessionStorage.setItem("userData", JSON.stringify({ id: data.user.id, name: data.user.name, surnames: data.user.surnames }));
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
				const actions = getActions();
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/logout', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + sessionStorage.getItem("userToken")
						}
					});

					const data = await response.json();

					if (response.ok) {
						console.log("Logout successful:", data);
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

			handleResetPassword: async (email) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/reset-password`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ email })
					});
					const result = await response.json();

					if (!response.ok)
						return { ok: false, message: result.message || "Ocurrió un error. Por favor, inténtalo de nuevo." }

					else {
						return { ok: true, message: "Consulta tu email para las instrucciones de reestablecimiento de contraseña." }
					}
				} catch (error) {
					return { ok: false, message: "Network error" };
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

					if (!response.ok) {
						let errorMessage = 'Hubo un error al restablecer la contraseña';
						if (response.status === 400) {
							errorMessage = 'La solicitud es incorrecta';
						} else if (response.status === 404) {
							errorMessage = 'No se encontró el recurso';
						}
						throw new Error(errorMessage);
					}
					return response;
				} catch (error) {
					console.error("Error reset password:", error);
					return { ok: false, message: "Network error" };
				}
			},

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
						// setStore({ user: data.user });
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
				let token = sessionStorage.getItem("userToken");
				// let user = JSON.parse(sessionStorage.getItem("userData"));

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
						setStore({ ...getStore(), auth: data.is_logged })
						console.log('Login successful:', data);
						return true;
					}
					else {
						sessionStorage.removeItem("userToken");
						sessionStorage.removeItem("userData");
						setStore({ ...getStore(), auth: false, user: null })
						return false;
					}
				} catch (error) {
					console.error('Token expired:', error);
					sessionStorage.removeItem("userToken");
					sessionStorage.removeItem("userData");
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
						getActions().clearUser();
						setStore({ ...getStore(), auth: false, user: null });
					} else {
						console.log("Hubo un error al eliminar la cuenta:", data.error);
					}
				} catch (error) {
					console.log("Error deleting account from database", error);
				}
			},

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

			getAllMoods: async () => {
				try {
					const urlActiveLocations = process.env.BACKEND_URL + `/api/moods`;
					const token = sessionStorage.getItem('userToken');

					const response = await fetch(urlActiveLocations, {
						method: 'GET',
						headers: {
							'Authorization': `Bearer  ${token}`
						}
					});

					if (!response.ok) {
						throw new Error(`Failed to fetch mood data: ${response.status} ${response.statusText}`);
					}

					//devuelve 5 moods, 1 por cada categoría elegidos aleatoriamente
					const data = await response.json();

					setStore({ ...getStore(), mood: data });
					console.log("5 aletory mood loaded from the API to store.", data);

					return data.results;
				} catch (error) {
					console.error('Error fetching or processing mood data:', error);
					return false;
				}
			},



			saveMood: async (mood) => {
				try {
					const response = await fetch('/api/save-mood', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ mood: mood })
					});
					if (!response.ok) {
						throw new Error('Error al guardar el estado de ánimo');
					}
					console.log('Estado de ánimo guardado correctamente');
				} catch (error) {
					console.error('Error al guardar el estado de ánimo:', error);
				}
			},

			getAllActiveUsers: async () => {
				try {
					const urlActiveLocations = process.env.BACKEND_URL + `/api/users/active-locations`;

					// Obtén el token JWT del sessionStorage
					const token = sessionStorage.getItem('userToken');
					if (!token) {
						console.error('No token available, user not logged in.');
						setStore({ ...getStore(), user: null });
						return false;
					}
					const response = await fetch(urlActiveLocations, {
						method: 'GET',
						headers: {
							'Authorization': `Bearer  ${token}`
						}
					});

					if (!response.ok) {
						throw new Error(`Failed to fetch active users data: ${response.status} ${response.statusText}`);
					}

					const data = await response.json();

					// Actualizar el estado con las ubicaciones de los usuarios activos
					console.log(data);
					setStore({ active_users: data });

					console.log("Active users loaded from the API to store.");

					return true;
				} catch (error) {
					console.error('Error fetching or processing active location data:', error);
					return false;
				}
			},

			saveUserLocation: async () => {
				try {
					// Obtén la ubicación del usuario
					const position = await new Promise((resolve, reject) =>
						navigator.geolocation.getCurrentPosition(resolve, reject));

					const latitude = position.coords.latitude;
					const longitude = position.coords.longitude;


					const token = sessionStorage.getItem('userToken');
					const userId = JSON.parse(sessionStorage.userData).id;

					console.log("Id de usuario: " + userId);

					const urlLocation = process.env.BACKEND_URL + `/api/user/location`;

					const requestBody = JSON.stringify({ user_id: userId, latitude, longitude });


					const response = await fetch(urlLocation, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						},
						body: requestBody,
					});

					console.log("Respuesta del servidor: ", response);

					if (!response.ok) {
						const responseBody = await response.text();
						console.error("Cuerpo de la respuesta del error: " + responseBody);
						throw new Error(`Error al obtener los datos de ubicación: ${response.status} ${response.statusText}`);
					}

					const data = await response.json();

					// Actualiza el estado con las ubicaciones
					console.log(data);
					setStore(prevState => ({
						...prevState,
						active_users: Array.isArray(prevState.location) ? [...prevState.location, data] : [data]
					}));
					getActions().getAllActiveUsers();
					console.log("Ubicaciones cargadas desde la API al almacenamiento.");
					return true

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
						getActions().getAllActiveUsers(),
						setStore(prevState => ({
							...prevState,
							active_users: [{ latitude, longitude }]

						}));



				} catch (error) {
					console.error('Error getting user location:', error.message);

				}
			},

			getAllResources: async () => {
				try {
					const urlActiveLocations = process.env.BACKEND_URL + `/api/resources-bytype`;

					// Obtén el token JWT del sessionStorage
					// const token = sessionStorage.getItem('userToken');

					const response = await fetch(urlActiveLocations, {
						method: 'GET',
						// headers: {
						// 	'Authorization': `Bearer  ${token}`
						// }
					});

					if (!response.ok) {
						throw new Error(`Failed to fetch active location data: ${response.status} ${response.statusText}`);
					}

					const data = await response.json();

					// Actualizar el estado con las ubicaciones de los usuarios activos
					console.log(data);
					setStore({ ...getStore(), resources: data.results });

					console.log(getStore().resources);
					console.log("Resources loaded from the API to store.");

					return true;
				} catch (error) {
					console.error('Error fetching or processing resources data:', error);
					return false;
				}
			},

			getCurrentUser: async () => {
				try {
					const token = sessionStorage.getItem('userToken');
					if (!token) {
						console.error('No token available, user not logged in.');
						setStore({ ...getStore(), user: null });
						return false;
					}
					const response = await fetch(`${process.env.BACKEND_URL}/api/current-user`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						}
					});


					if (!response.ok) {
						throw new Error('Failed to fetch current user data');

					}
					const data = await response.json();
					console.log(data);
					setStore({ ...getStore(), user: data });

					console.log(getStore().user);
					console.log('Current user data loaded from the API to store');
					return true;
				} catch (error) {
					console.error('Error fetching or processing current user data:', error);
					return false;
				}
			},

			updateUserMood: async (user_id, mood_id) => {
				try {
					console.log("USER ID:" + user_id, "MOOD ID:" + mood_id);
					const token = sessionStorage.getItem('userToken');
					const response = await fetch(`${process.env.BACKEND_URL}/api/user/${user_id}/mood`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						},
						body: JSON.stringify({ user_id, mood_id })
					});
					if (!response.ok) {
						throw new Error('Error al actualizar el estado de ánimo del usuario');
					}
					console.log('Estado de ánimo del usuario actualizado correctamente');
					return response
				} catch (error) {
					console.error('Error al actualizar el estado de ánimo del usuario:', error);
					return false
				}
			},

			getAllUsers: async () => {
				try {
					const token = sessionStorage.getItem('userToken');
					if (!token) {
						console.error('No token available, user not logged in.');
						setStore({ ...getStore(), all_users: [] });
						return false;
					}
					const response = await fetch(`${process.env.BACKEND_URL}/api/users`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						}
					});


					if (!response.ok) {
						throw new Error('Failed to fetch ALL user data');

					}
					const data = await response.json();
					console.log(data);
					setStore({ ...getStore(), all_users: data.results });

					return true;
				} catch (error) {
					console.error('Error fetching or processing ALL user data:', error);
					return false;
				}
			},

			getUserById: async (user_id) => {
				try {
					const token = sessionStorage.getItem('userToken');
					if (!token) {
						console.error('No token available, user not logged in.');
						return null;
					}
					const response = await fetch(`${process.env.BACKEND_URL}/api/user/${user_id}`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						}
					});

					if (!response.ok) {
						throw new Error('Failed to fetch ALL user data');

					}
					const data = await response.json();
					console.log("ESTE ES EL GETUSERBYID", data.results);
					return data.results;

				} catch (error) {
					console.error('Error fetching or processing ALL user data:', error);
					return null;
				}
			},

			handleUserClick: (otherUserId) => {
				const userData = JSON.parse(sessionStorage.getItem('userData'));
				const currentUserId = userData.id;
			
				const roomId = `chat_${Math.min(currentUserId, otherUserId)}_${Math.max(currentUserId, otherUserId)}`;

				console.log(otherUserId);
				// setOtherUserId(otherUserId); 
				// setRoomId(roomId);.
				setStore({ ...getStore(), room: roomId })
				console.log("Joining room 1. :", roomId, currentUserId, otherUserId);
				socket.emit('join', { user_id: currentUserId, other_user_id: otherUserId, room: roomId });
			},

			getAllPsychologist: async () => {
				try {
					const token = sessionStorage.getItem('userToken');
					if (!token) {
						console.error('No token available, user not logged in.');
						setStore({ ...getStore(), user: null });
						return false;
					}
					const response = await fetch(`${process.env.BACKEND_URL}/api/psychologist`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						}
					});

					if (!response.ok) {
						throw new Error('Failed to fetch get ALL psychologist');
					}
					const data = await response.json();
					setStore({ ...getStore(), allPsychologist: data.results });
					console.log('ALL Psichologist data loaded from the API to store', getStore().allPsychologist);
					return true;
				} catch (error) {
					console.error('Error fetching or processing ALL psychologist:', error);
					return false;
				}
			},

			getPsychologistResources: async (psychologistId) => {
				try {
					const token = sessionStorage.getItem('userToken');
					if (!token) {
						console.error('No token available, user not logged in.');
						setStore({ ...getStore(), user: null });
						return false;
					}
					const response = await fetch(`${process.env.BACKEND_URL}/api/ps-resources/${psychologistId}`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						}
					});

					if (!response.ok) {
						throw new Error('Failed to fetch get psychologist resources');
					}
					const data = await response.json();
					setStore({ ...getStore(), psychologist_resources: data.results });
					console.log('Psichologist resources data loaded from the API to store', getStore().psychologist_resources);
					return true;
				} catch (error) {
					console.error('Error fetching or processing current user data:', error);
					return false;
				}
			},

			getPsychologistData: async (psychologistId) => {
				try {
					const token = sessionStorage.getItem('userToken');
					if (!token) {
						console.error('No token available, user not logged in.');
						setStore({ ...getStore(), user: null });
						return false;
					}
					const response = await fetch(`${process.env.BACKEND_URL}/api/psychologist/${psychologistId}`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						}
					});

					if (!response.ok) {
						throw new Error('Failed to fetch get psychologist resources');
					}
					const data = await response.json();
					setStore({ ...getStore(), psychologist_info: data.results });
					console.log('Psichologist data loaded from the API to store', getStore().psychologist_info);
					return true;
				} catch (error) {
					console.error('Error fetching or processing current user data:', error);
					return false;
				}
			},



		}
	};
};


export default getState;
