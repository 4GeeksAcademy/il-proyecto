import ResetPassword from "../component/resetPassword";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			// MYMOOD
			user: null,
			auth: false
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
			
			// Backend is running
			getMessage: async () => {
				try  {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}  catch  (error)  {
					console.log("Error loading message from backend", error)
				}
			},



			saveMood : async (mood) => {
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

		}
	};
};


	export default getState;
