import React from 'react';

/* React Boostrap */
import { Container, Row, Col, Accordion } from 'react-bootstrap';

const AccordionFaqs = () => {
  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>¿Qué es My Mood?</Accordion.Header>
                <Accordion.Body>
                  MyMood es una plataforma integral de apoyo emocional y profesional 
                  diseñada para ayudarte a gestionar tus estados de ánimo. 
                  Ofrece una comunidad solidaria donde puedes conectarte con otros 
                  usuarios que comparten experiencias similares. Desde seguimiento 
                  personalizado hasta recursos prácticos, MyMood te acompaña en tu viaje emocional,
                  proporcionándote las herramientas necesarias para alcanzar tu bienestar.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Solo podrás registarte si tienes más de 16 años</Accordion.Header>
                <Accordion.Body>
                MyMood establece un requisito de edad mínima de 16 años para registrarse en la plataforma, 
                garantizando un entorno seguro y adecuado para los usuarios. 
                Este límite de edad contribuye a mantener la integridad de la comunidad 
                y a proteger la privacidad y el bienestar de los usuarios más jóvenes.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>¿Puedo tener más de una cuenta?</Accordion.Header>
                <Accordion.Body>
                MyMood permite a los usuarios tener una única cuenta para garantizar la integridad 
                y la autenticidad dentro de la plataforma. 
                Esto ayuda a mantener un ambiente de comunidad cohesivo y seguro. 
                Sin embargo, si tienes razones específicas para necesitar más de una cuenta, 
                te recomendaría ponerse en contacto con el soporte de MyMood para obtener orientación adicional sobre tu situación particular.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>¿Cómo me doy de baja?</Accordion.Header>
                <Accordion.Body>                 
                  Para darte de baja de MyMood, generalmente puedes seguir estos pasos:
                  Inicia sesión en tu cuenta de MyMood.
                  Dirígete a la configuración o ajustes de tu cuenta.
                  Busca la opción de "Dar de baja".
                  Es posible que te soliciten que confirmes tu decisión de cerrar tu cuenta. Sigue las instrucciones que se te proporcionen para completar el proceso.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </>

  );
}

export default AccordionFaqs;