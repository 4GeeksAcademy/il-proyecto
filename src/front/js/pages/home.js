import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import "../../styles/landing.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, } from 'react-bootstrap';
import "../../styles/home.css";


/*App*/
// import MoodRectangle from "../component/moodRectangle";
// import AccordionFaqs from "../component/accordeonFaqs";

export const Home = () => {

	
	return (

		<Container fluid className="container-landingpage">
			<button id="scrollToTopBtn">↑</button>

			<Container>
				<Row className="align-items-center">
					<Col xs={1} md={3} className="text-center align-items-center">
					<div className="d-flex flex-column align-items-center">
						<img src="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Home%2Flanding1.png?alt=media&token=e2f9a180-4252-490e-b050-295af756c1e9" alt="Image 1" className="image-top-left-container1" fluid/>
						<img src="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Home%2Fsad.png?alt=media&token=307f6133-f77f-4404-98b1-5a10de5ecf5d" alt="Image 2" className="image-bottom-left-container1" fluid/>
					</div>
					</Col>
					<Col xs={10} md={6} className="text-center">
						<h1 className="heading1">Bienvenidxs a</h1>
						<h2 className="heading2">la Comunidad <br />de Apoyo <br />Emocional</h2>
					</Col>
					<Col xs={1} md={3} >
					<div className="d-flex flex-column align-items-center">
                    	<img src="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Home%2Fskate.png?alt=media&token=28f0e303-9cc8-468d-83ec-1f1d593cb91a" alt="Image 3" className="image-top-right-container1" fluid/>
                    	<img src="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Home%2Femotions.png?alt=media&token=3d93a047-9250-4c1c-aae9-d2ae74f1ff61" alt="Image 4" className="image-bottom-right-container1" fluid/>
                	</div>
					</Col>
				</Row>
			</Container>

			<Container fluid className="second-container-landingpage">
				<Row className="text-center">
					<Col xs={12}>
						<h1 className="heading1">Donde los <span className="heading2">sentimientos</span><br /> se <span className="heading2">comparten</span></h1>
						<p className="base-paragrahp">Descubre, Conéctate, Comparte. En MyMood, creemos en el poder de la conexión y el apoyo mutuo para navegar por los altibajos emocionales de la vida.
							Diseñada pensando en la juventud, nuestra plataforma es más que una simple red social;
							es un refugio seguro donde puedes expresar tus emociones, encontrar comprensión y acceder a recursos que enriquecen tu bienestar mental.
						</p> <br /><br /><br />
						<button className="button1 button-second-container-landingpage"> Únete a Mymood ¡hoy!</button>
					</Col>
				</Row>
			</Container>

			<Container fluid className="third-container-landingpage">
				<Row >
					<Col xs={12} md={8} className="text-left">
						<h1 className="heading-thirdcontainer">Define tu estado con MyMood </h1>
						<p className="base-paragrahp">Descubre, Conéctate, Comparte. En MyMood, creemos en el poder de la conexión y el apoyo mutuo para navegar por los altibajos emocionales de la vida.
							Diseñada pensando en la juventud, nuestra plataforma es más que una simple red social;
							es un refugio seguro donde puedes expresar tus emociones, encontrar comprensión y acceder a recursos que enriquecen tu bienestar mental.
						</p> <br /><br />
					</Col>
					<Col xs={12} md={4} className="d-flex justify-content-center align-items-center" >
						<div className="d-flex flex-column align-items-center">
							<img src="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Home%2Fphotos.png?alt=media&token=3d8d7c93-7121-4455-9199-b4bae6247dd4" alt="Image 5" className="image-third-container-landingpage" fluid/>
						</div>	
					</Col>
				</Row>
			</Container>


			<Container fluid className="fourth-container-landingpage">
				<Row >
					
					<Col xs={12} md={3} className="d-flex justify-content-center align-items-center" >
						<div className="d-flex flex-column align-items-center">
							<img src="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Home%2Froad.png?alt=media&token=9f47e6d8-cc99-4112-ae69-bb4d150b03d1" alt="Image 5" className="image-fourth-container-landingpage" fluid/>	
						</div>
					</Col>

					<Col xs={12} md={8} className="text-left">
					
						<div className="fourth-container">
							<h1 className="heading-fourth-container">Tu recorrido emocional es nuestro compromiso:</h1>
							<p className="base-paragrahp">MyMood te permite llevar un diario emocional para visualizar tu evolución. 
							¿Buscas apoyo? Conéctate con expertos en salud mental de forma discreta. 
							Cada paso hacia la comprensión de tus emociones es un paso hacia tu felicidad.
							Cada paso hacia la comprensión de tus emociones es un paso hacia tu felicidad.
							Cada paso hacia la comprensión de tus emociones es un paso hacia tu felicidad.
							</p> <br /><br />
						</div>
					</Col>

					<Col xs={12} md={1} className="d-flex justify-content-center align-items-center" >
						<div className="d-flex flex-column align-items-center">
							<img src="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Home%2Fhappy.png?alt=media&token=a9a6dff6-8fe4-4d48-a61c-dbea526616df" alt="Image 5" className="image-happy-fiveth-container-landingpage" fluid/>	
							<img src="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Home%2Fserious.png?alt=media&token=56bdb012-834d-4a9b-87f1-6f5885f4edc2" alt="Image 5" className="image-serious-fiveth-container-landingpage" fluid/>	
							<img src="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Home%2Fangry.png?alt=media&token=648f3a16-beb6-49f0-a9cd-34d4dabc8584" alt="Image 5" className="image-angry-fiveth-container-landingpage" fluid/>	
						</div>
					</Col>

				</Row>
			</Container>


			<Container fluid className="fiveth-container-landingpage">
				<Row >
					<Col xs={12} md={7} className="text-left">
						<h1 className="heading-fivethcontainer">Unidos en la diversidad emocional </h1>
						<p className="base-paragrahp">MyMood te permite llevar un diario emocional para visualizar tu evolución. 
						¿Buscas apoyo? Conéctate con expertos en salud mental de forma discreta. 
						Cada paso hacia la comprensión de tus emociones es un paso hacia tu felicidad.
						</p> <br /><br />
					</Col>
					<Col xs={12} md={5} className="d-flex justify-content-center align-items-center" >
						<div className="d-flex flex-column align-items-center">
							<img src="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Home%2Fpills.png?alt=media&token=ba5f83fd-87ef-431b-98c3-56f17855f4ce" alt="Image 5" className="image-sixth-container-landingpage" fluid/>
						</div>			
					</Col>
				</Row>
			</Container>


			<Container fluid className="sixth-container-landingpage">
				<Row className="text-center">
					<Col xs={12}>
						<h1 className="heading1 heading6-container-landing-page">Conexión <span className="heading2">profesional</span><br /> al alcance <span className="heading2">de tus manos</span></h1>
						<p className="base-paragrahp">Descubre, Conéctate, Comparte. En MyMood, creemos en el poder de la conexión y el apoyo mutuo para navegar por los altibajos emocionales de la vida.
							Diseñada pensando en la juventud, nuestra plataforma es más que una simple red social;
							es un refugio seguro donde puedes expresar tus emociones, encontrar comprensión y acceder a recursos que enriquecen tu bienestar mental.
						</p> <br /><br /><br />
						<button className="button1 button-second-container-landingpage"> Únete a Mymood ¡hoy!</button>
					</Col>
					
				</Row>
			</Container>


		</Container>

	);
}