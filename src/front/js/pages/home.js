import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import landing1 from "../../img/home img/landing1.png";
import sad from "../../img/home img/sad.png";
import skate from "../../img/home img/skate.png";
import emotions from "../../img/home img/emotions.png";
import photos from "../../img/home img/photos.png";
import road from "../../img/home img/road.png";
import angry from "../../img/home img/angry.png";
import serious from "../../img/home img/serious.png";
import happy from "../../img/home img/happy.png";
import pills from "../../img/home img/pills.png";
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
						<img src={landing1} alt="Image 1" className="image-top-left-container1" fluid/>
						<img src={sad} alt="Image 2" className="image-bottom-left-container1" fluid/>
					</div>
					</Col>
					<Col xs={10} md={6} className="text-center">
						<h1 className="heading1">Bienvenidxs a</h1>
						<h2 className="heading2">la Comunidad <br />de Apoyo <br />Emocional</h2>
					</Col>
					<Col xs={1} md={3} >
					<div className="d-flex flex-column align-items-center">
                    	<img src={skate} alt="Image 3" className="image-top-right-container1" fluid/>
                    	<img src={emotions} alt="Image 4" className="image-bottom-right-container1" fluid/>
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
							<img src={photos} alt="Image 5" className="image-third-container-landingpage" fluid/>
						</div>	
					</Col>
				</Row>
			</Container>


			<Container fluid className="fourth-container-landingpage">
				<Row >
					
					<Col xs={12} md={3} className="d-flex justify-content-center align-items-center" >
						<div className="d-flex flex-column align-items-center">
							<img src={road} alt="Image 5" className="image-fourth-container-landingpage" fluid/>	
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
							<img src={happy} alt="Image 5" className="image-happy-fiveth-container-landingpage" fluid/>	
							<img src={serious} alt="Image 5" className="image-serious-fiveth-container-landingpage" fluid/>	
							<img src={angry} alt="Image 5" className="image-angry-fiveth-container-landingpage" fluid/>	
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
							<img src={pills} alt="Image 5" className="image-sixth-container-landingpage" fluid/>
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