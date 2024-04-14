import { set } from "firebase/database";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			], 
			// MYMOOD
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



			saveUserLocation: async (latitude, longitude) => {
				const url = 'https://cuddly-happiness-7vvvx7wrjp64hppg-3001.app.github.dev/admin/location';
				const data = {
				  latitude,
				  longitude
				};
				
				try {
				  const response = await fetch(url, {
					method: 'POST',
					headers: {
					  'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
				  });
				  
				  const result = await response.json();
		
				  // Actualizar el estado del store con la nueva ubicación
				  setStore({ location: result.location });
		
				  return result; // Opcional: devolver el resultado de la operación
				} catch (error) {
				  console.error('Error al guardar la ubicación del usuario:', error);
				  throw error;
				}
			  },



			  getAllLocations: async () => {
                try {
                    const storedDataLocation = localStorage.getItem("locationData");

                    if (storedDataLocation) {
                        setStore({ location: JSON.parse(storedDataLocation) });
                    } else {
                        const fetchPromises = [];
                        const urlLocation = `https://cuddly-happiness-7vvvx7wrjp64hppg-3001.app.github.dev/location`;
						const fetchPromise = fetch(urlLocation)
						.then(res => res.json())
						.catch(err => console.error(`Error to get data from ${urlLocation}: ${err}`));

					fetchPromises.push(fetchPromise);
                        

                        const location = await Promise.all(fetchPromises);

                        setStore({ location });

                        localStorage.setItem("locationData", JSON.stringify(location));
                    }
                } catch (error) {
                    console.error('Error to get location details:', error);
                }
            },

			// getAllLocations: async () => {
			// 	const url = 'https://cuddly-happiness-7vvvx7wrjp64hppg-3001.app.github.dev/location';
				
			// 	try {
			// 		const response = await fetch(url, {
			// 			method: 'GET',
			// 			headers: {
			// 				'Content-Type': 'application/json'
			// 			}
			// 		});
				
			// 		if (!response.ok) {
			// 			throw new Error('Error al obtener las localizaciones');
			// 		}
				
			// 		const locationsData = await response.json();
			// 		console.log('Localizaciones obtenidas:', locationsData);
				
			// 		setStore({ location: locationsData }); // Corregir el nombre de la variable a `locationsData`
				
			// 		return locationsData;
			// 	} catch (error) {
			// 		console.error('Error al obtener las localizaciones:', error);
			// 		throw error;
			// 	}
			// },



			// getAllLocations: async () => {
			// 	try {
			// 		// Realiza una solicitud GET a la URL del servicio que devuelve las ubicaciones
			// 		const response = await fetch('https://cuddly-happiness-7vvvx7wrjp64hppg-3001.app.github.dev/location', {
			// 			method: 'GET',
			// 			headers: {
			// 				'Content-Type': 'application/json'
			// 			}
			// 		});
			
			// 		// Verifica si la respuesta es exitosa (código 200)
			// 		if (!response.ok) {
			// 			throw new Error('Error al obtener las ubicaciones');
			// 		}
			
			// 		// Parsea la respuesta JSON obtenida
			// 		const locationsData = await response.json();
			
			// 		// Actualiza el estado del store con las ubicaciones obtenidas
			// 		setStore({ location: result.location });
			
			// 		console.log('Ubicaciones obtenidas:', locationsData);
			
			// 		// Devuelve las ubicaciones obtenidas (opcional)
			// 		return locationsData;
			// 	} catch (error) {
			// 		// Captura y maneja cualquier error durante la solicitud
			// 		console.error('Error al obtener las ubicaciones:', error);
			// 		throw error; // Lanza el error para que pueda ser manejado por el código que llama a esta función
			// 	}
			// },
			


			// getAllLocations: async () => {
			// 	try {
			// 		const locationData = localStorage.getItem("locationData");
			
			// 		if (locationData) {
			// 			setStore({ location: JSON.parse(locationData) });
			// 		} else {
			// 			const urlLocation = `https://cuddly-happiness-7vvvx7wrjp64hppg-3001.app.github.dev/admin/location`;
			// 			const response = await fetch(urlLocation);
			
			// 			if (!response.ok) {
			// 				throw new Error(`Failed to fetch location data: ${response.status} ${response.statusText}`);
			// 			}
			
			// 			const location = await response.json();
			
			// 			// Verifica la estructura de los datos recibidos
			// 			if (Array.isArray(location)) {
			// 				setStore({ location });

			// 				localStorage.setItem("locationData", JSON.stringify(location));
			// 			} else {
			// 				throw new Error("Unexpected location data format");
			// 			}
			// 		}
			// 	} catch (error) {
			// 		console.error('Error fetching or processing location data:', error);
			// 	}
			// },
			
					
			  
			

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
			},
			
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
