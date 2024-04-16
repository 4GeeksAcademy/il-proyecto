const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			// MYMOOD
			user: null
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
			
			requestPasswordReset: async (email) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/reset-password`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ email })
					});
					const data = await response.json();
					if (response.ok) {
						return { success: true, message: "Check your email for the password reset instructions." };
					} else {
						return { success: false, message: data.message || "An error occurred while trying to process your request." };
					}
				} catch (error) {
					console.error("Error in requestPasswordReset:", error);
					return { success: false, message: "An unexpected error occurred." };
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
	
			// Backend is running
			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			}
		}
	};
};

export default getState;
