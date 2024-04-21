import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

/* React boostrap */
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/* APP */
import { Context } from "../store/appContext";
import AccordionFaqs from "../component/accordeonFaqs";
import CallToAction from '../component/callToAction';


export const Legal = () => {
    const { store, actions } = useContext(Context);

    return (
        <Container fluid className="mt-3 mb-3 py-3 container-landingpage">
            <Container>
            <div>
                <h1 className="heading1" id="legal">Aviso legal</h1>
                <p>Le damos la bienvenida a nuestra web y le agradecemos su interés por leer las condiciones legales de nuestra web. Somos conscientes de que este tema puede no ser su preferido, pero es importante que conozca toda la información relativa a los términos y condiciones legales que definen las relaciones entre los usuarios y nuestra empresa, como responsable de esta web. Como usuario es importante que conozca estos términos antes de continuar su navegación.</p>
                <p>Somos la empresa MY MOOD, SCOOP. (en adelante MYMOOD), como responsable de esta web, nos comprometemos a procesar la información de nuestros usuarios con plenas garantías y cumplir con los requisitos nacionales y europeos que regulan la recopilación y uso de los datos personales.</p>
                <p>Esta web, por tanto, cumple rigurosamente con el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo de 27 de abril de 2016 relativo a la protección de las personas físicas (RGPD), así como con la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSICE ó LSSI).</p>
                <p>En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico, a continuación, se exponen los datos identificativos de MYMOOD: </p>

                <ul>
                    <li>Titular: MY MOOD, SCOOP.</li>
                    <li>NIF: 44646888M</li>
                    <li>Dirección: Online</li>
                    <li>Teléfono: +34 659 087 234</li>
                    <li>Dirección de correo electrónico: mymood@mymood.com</li>

                </ul>

                <p>Inscripción Registral: Inscrita en el Registro Mercantil de Navarra, Tomo XXX, Folio XXX, Hoja NA-XXX.</p>

                <p>
                    1º) INFORMACIÓN SOBRE PROPIEDAD INTELECTUAL E INDUSTRIAL.
                    MYMOOD es el titular en exclusiva de los Derechos de Explotación del presente sitio web. MYMOOD se reserva todos los derechos de propiedad intelectual e industrial derivados del presente site, siendo necesaria la autorización expresa y por escrito por parte de MYMOOD para cualquier ejercicio y uso de los mismos. La presente reserva de derechos alcanza tanto a la apariencia externa (“look and feel”) como a los contenidos que bajo cualquier formato puedan incluirse y distribuirse a través de esta web, al propio código, diseño y estructura de navegación del site.

                    MYMOOD podrá realizar, en cualquier momento y sin necesidad de previo aviso, modificaciones y actualizaciones sobre la información contenida en su sitio web, o en su configuración o presentación. MYMOOD realiza todos los esfuerzos posibles para que la información suministrada a través de esta web sea clara, comprensible y adecuada, así como para evitar errores en la medida de lo posible y, en su caso, repararlos o actualizarlos. Sin embargo, MYMOOD no puede garantizar la inexistencia de errores ni que el contenido de la información se encuentre permanentemente actualizado.

                    MYMOOD en ningún caso será responsable del incumplimiento por parte de sus proveedores o colaboradores de los derechos de propiedad intelectual de los autores de las imágenes y fotografías suministradas por aquellos, presuponiéndose que los derechos de explotación sobre las mismas han sido debidamente cedidos por sus titulares a los citados proveedores.
                </p>
                <p>

                    2º) CONDICIONES Y TÉRMINOS DE REGISTRO Y ACCESO AL SITIO WEB.
                    El usuario, por el mero hecho de acceder al presente sitio, cualesquiera que sea la forma de dicho acceso, consiente y accede a las presentes condiciones, las cuales marcarán el régimen de utilización del presente site. El titular se reserva el derecho a alterarlas y modificarlas en cualquier momento, siendo las publicadas en la última actualización las que rigen y son aplicación en cada visita. Si el usuario no acepta la totalidad de las presentes condiciones no está autorizado a acceder al presente sitio web y a los contenidos y servicios en él alojados debiendo proceder a abandonar el sitio de forma inmediata. Las presentes condiciones son así mismo extensibles y aplicables a las comunicaciones y boletines que en su caso puedan remitirse por el titular del site, debiendo por tanto el usuario aceptar las presentes condiciones para su acceso y/o uso.

                    MYMOOD se reserva el derecho de excluir, temporalmente o definitivamente a los usuarios en cualquiera de los siguientes supuestos:
                    Por incumplimiento de cualquiera de las presentes condiciones generales de uso.
                    Por incumplimiento de las leyes, la moral, y el Orden Público.
                </p><p>
                    3º) OBJETO
                    www.MYMOOD.com es la web oficial de MYMOOD donde el usuario va a encontrar la mejor información sobre nuestra agencia de comunicación y branding.

                    En nuestra web podrá conocer a nuestro equipo, los servicios que prestamos, nuestros proyectos realizados, así como contactar con nosotros mediante el formulario habilitado al efecto o mediante correo electrónico en la dirección MYMOOD@MYMOOD.com reservándonos el derecho de poder ofrecer otros contenidos y enlaces relacionados o no con lo anterior.

                </p><p>
                    4º) POLÍTICA DE PROTECCIÓN DE DATOS PERSONALES.
                    Puedes leer qué datos que recopilamos y cómo tratamos los mismos y nuestra política de protección de datos.
                </p><p>


                    5º) VINCULACION A OTROS SITIOS WEB.
                    Se prohíbe la presentación de una página del sitio web en una ventana de un sitio web que no pertenezca al titular de la web www.MYMOOD.com, mediante la técnica denominada "framing", a no ser que cuente con el expreso consentimiento de MYMOOD.

                    Se prohíbe la inserción de cualquier tipo de contenido difundido a través de web www.MYMOOD.com, en otro sitio web distinto a aquel mediante la técnica denominada "in line linking", si ello, no cuenta con el expreso consentimiento de MYMOOD.

                    Se autoriza el establecimiento de links de hipertexto (hipervínculos) en otros sitios web, los cuales estén dirigidos a la home page web www.MYMOOD.com, o en su caso, a cualquier otra página interna (“deep link”) del sitio web, siempre que las correspondientes páginas aparezcan en una ventana completa y bajo sus respectivas direcciones IP, asumiendo su total responsabilidad y riesgo aquel que proceda al establecer el hipervínculo a web site.
                </p><p>
                    6º) RESPONSABILIDADES.
                    Los usuarios se comprometen a hacer un uso adecuado de los contenidos y servicios que MYMOOD ofrece a través de su sitio web y a no emplearlos para (I) incurrir en actividades ilícitas, ilegales o contrarias a la buena fe y al orden público; (II) difundir contenidos o propaganda de carácter racista, xenófobo, pornográfico-ilegal, de apología del terrorismo o atentatorio contra los derechos humanos; (III) provocar daños en los sistemas informáticos de MYMOOD o de sus proveedores; (IV) introducir o difundir en la red de MYMOOD virus informáticos o cualesquiera otros sistemas que sean susceptibles de provocar los daños, (V) desarrollar actividades que tengan que ver con técnicas de des compilación o descodificación de contenido, no autorizadas.

                    En el caso de que el usuario o cualquier otro usuario de Internet tuviera conocimiento de que en el sitio web exhibe contenidos o servicios ilícitos, nocivos, denigrantes, violentos o contrarios a la moral o de que los sitios enlazados remiten a páginas con dicho contenido, deberá ponerse en contacto con MYMOOD en la dirección de correo electrónico indicada en este aviso legal, identificándose de forma suficiente si fuese preciso y describiendo los hechos que considera ilícitos o inadecuados. En el supuesto de violación de derechos tales como los de propiedad intelectual e industrial, deberá aportar también los datos personales del titular del derecho infringido, cuando sea persona distinta del comunicante. Asimismo, deberá aportar el título que acredite la legitimación del titular de los derechos y, en su caso, el de representación para actuar por cuenta del titular cuando sea persona distinta del comunicante, y declaración expresa de que la información contenida en la reclamación es exacta.

                    La recepción por parte de MYMOOD de la comunicación prevista en esta cláusula no supondrá, según lo dispuesto en la LSSI, el conocimiento efectivo de las actividades y/o contenidos indicados por el comunicante.

                    MYMOOD no garantiza de ninguna forma la precisión, contenido, integridad, legalidad, fiabilidad, actualidad, veracidad, exactitud, funcionamiento o disponibilidad de los contenidos y servicios que ofrece, declinando cualquier responsabilidad sobre los mismos, así como los perjuicios que en su caso puedan contemplar. La información que se ofrece tiene un carácter meramente informativo y no es representativa de nada. Lo dicho anteriormente es extensible a los enlaces, contenidos y opiniones no pertenecientes al titular u no alojados en el presente sitio web, correspondiendo la responsabilidad en todo caso a los titulares de los contenidos y de los sitios en cuestión. Así mismo, MYMOOD no se hace responsable del uso incorrecto que en su caso pudiera efectuarse de los contenidos ofrecidos, declinando toda responsabilidad al respecto.

                    MYMOOD no se hace responsable directa o subsidiariamente de cuantas reclamaciones puedan derivarse de la calidad, fiabilidad, exactitud o corrección de los contenidos.

                </p><p>

                    7º) PRESTACIÓN DEL SERVICIO.
                    MYMOOD se reserva el derecho a modificar sus programas, así como la sistematización de los datos suministrados y las características técnicas de acceso y transmisión. Cuando dichos cambios no permitan un uso compatible con las versiones anteriores instaladas, MYMOOD, lo comunicará a través de su sitio web. Igualmente se reserva el derecho de interrumpir parcial o totalmente el servicio por cambios técnicos o averías, comunicándolo previamente a través de su sitio web si es posible o a través de cualquier otro sitio habilitado al efecto.

                    MYMOOD velará, en la medida de lo posible, por la seguridad informática de los soportes técnicos usados por el usuario en su navegación por las páginas del sitio web. Sin embargo, debido a que Internet no puede ser considerado un medio seguro, MYMOOD no puede garantizar la ausencia de virus u otros elementos lesivos, introducidos por terceros, que pudieran causar daños o alteraciones en el sistema informático, en los documentos electrónicos o en los ficheros del usuario que visite este Sitio Web. En consecuencia, MYMOOD no responderá por los daños y perjuicios que tales elementos pudieran ocasionar al usuario o a terceros.

                    No es responsabilidad de MYMOOD el sistema operativo que en este momento esté implantado, ni las consecuencias que de un mal funcionamiento del mismo pudieran derivarse.
                    MYMOOD se reserva el derecho de efectuar sin previo aviso las modificaciones que considere oportunas en su sitio web, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se presten a través de la misma como la forma en la que éstos aparezcan presentados o localizados en su sitio web.

                </p><p>

                    8º) DERECHOS DE IMAGEN Y DISCLAIMER.
                    MYMOOD no se hace responsable de los contenidos, informaciones e imágenes que no dependan del Web site, ni sean gestionados por MYMOOD aunque aparezcan en el Web site en virtud de cualquier convenio firmado por MYMOOD.

                </p><p>

                    9º) INFRACCIONES.
                    MYMOOD perseguirá el incumplimiento de las anteriores condiciones así como cualquier utilización prohibida e indebida de su sitio web ejerciendo todas las acciones civiles y penales que le puedan corresponder en derecho.

                </p><p>
                    10º) VALIDEZ.
                    En el caso de que alguna cláusula o parte de la misma del presente aviso fuera declarada nula, dicha circunstancia no afectará a la validez del resto.

                </p><p>
                    11º) JURISDICCIÓN Y FUERO APLICABLE.
                    La ley aplicable a cualquier controversia que se suscite con relación al presente site y a los contenidos en él ofrecidos, será la ley española. Las partes acuerdan someterse a los Juzgados y Tribunales de la ciudad de Pamplona, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.

                </p><br></br><p>Última actualización el 16 de abril de 2024</p>
                <h1 className="heading1" id="policy">Política de privacidad</h1>
                <p>
                    Tu privacidad es importante para nosotros, y también lo es la transparencia acerca de cómo recopilamos, usamos y compartimos información sobre ti. Esta política tiene como objetivo ayudarte a comprender, principalmente:</p>
                <ul>
                    <li>Acceso a la web por parte de menores</li>
                    <li>Quiénes somos</li>
                    <li>Para qué tratamos tus datos</li>
                    <li>Durante cuánto tiempo utilizamos la información recabada</li>
                    <li>Cuál es la base legitimadora del tratamiento</li>
                    <li>Cuál es la información que recopilamos sobre ti</li>
                    <li>Con quien compartimos la información que recogemos</li>
                    <li>Cómo almacenamos y protegemos la información que recopilamos</li>
                    <li>Qué derechos tienes cuando nos facilitas tus datos</li>
                    <li>Cómo gestionaremos los cambios en nuestra política de privacidad</li>
                </ul>

                <h2>1. Menores de edad</h2>

                <p>Conforme a lo dispuesto en la normativa de protección de datos MAGMA COMUNICACIÓN, SCOOP. (en adelante MYMOOD) determina como requisito indispensable para que puedas acceder a esta web que tengas más de 16 años. Si eres menor de 16 años y has accedido a este sitio web no debes proporcionarnos ningún dato tuyo. La responsabilidad de la veracidad de esta información recae sobre tí. MYMOOD en el supuesto de que compruebe que no se cumple el citado requisito, tiene la potestad para hacer caso omiso a la solicitud de información remitida. En ningún caso se recabarán del menor de edad datos relativos a la situación profesional, económica o a la intimidad de los otros miembros de la familia, sin el consentimiento de éstos.</p>

                <h2>2. ¿Quién es el Responsable del tratamiento de tus datos?</h2>

                <p>MYMOOD, SCOOP. con CIF F711111111, con domicilio en C/ Larrazko nº 93, oficina 229, 31013, Antsoain (Navarra), teléfono: +34 948 278 189 y dirección de correo electrónico: MYMOOD@MYMOOD.com.</p>

                <h2>3. ¿Con qué finalidad tratamos tus datos personales?</h2>

                <p>Los datos que nos mandes por correo electrónico los empleamos para contestar a la solicitud de información planteada.</p>
                <p>Cualquier modificación que pueda en su caso producirse en los datos de carácter personal, deberá ser puesta en conocimiento por parte del titular de los mismos, respondiendo en cualquier caso de la veracidad y exactitud de los datos suministrados en cada momento</p>

                <h2>4. ¿Por cuánto tiempo conservaremos tus datos?</h2>

                <p>Tus datos remitidos serán conservados mientras no revoques tu consentimiento para que los tratemos, en cuyo caso tus datos serán conservados únicamente durante el plazo exigido por la normativa legal aplicable.</p>
                <p>Tratamos tus datos de manera lícita, leal, transparente, adecuada, pertinente, limitada, exacta y actualizada. Es por ello que nos comprometemos a adoptar todas las medidas razonables para que estos se supriman o rectifiquen sin dilación cuando sean inexactos.</p>

                <h2>5. ¿Cuál es la legitimación para el tratamiento de tus datos?</h2>

                <p> La base jurídica para el tratamiento de tus datos es tu consentimiento manifestado expresamente al remitirnos un correo electrónico.</p>
                <p>En el caso de que se suministren datos de terceros, declaras contar con el consentimiento de los titulares de los mismos para la citada comunicación de datos o en su caso ostentar su representación legal, eximiendo de toda responsabilidad a MYMOOD.</p>

                <h2>6. ¿Qué tipos de datos tratamos?</h2>

                <p>Las categorías de datos que se tratamos son datos identificativos.</p>
                <p>No tratamos categorías especiales de datos personales.</p>

                <h2>7. ¿A qué destinatarios se comunicarán tus datos?</h2>

                <p>Los datos no se cederán a terceros salvo en los casos en que exista una obligación legal o sea preciso para el cumplimiento de la finalidad del tratamiento.</p>
                <p>En este último sentido, para prestar servicios estrictamente necesarios para el desarrollo de nuestra actividad, MYMOOD, comparte datos con prestadores de servicios tales como el servicio de alojamiento o el administrador de la web, proveedores con quienes tenemos firmados los correspondientes contratos de encargado de tratamiento conforme a la normativa vigente en materia de protección de datos.</p>
                <p>Todas las utilidades ofrecidas por terceros son estrictamente necesarias para el desarrollo de nuestros servicios y han sido seleccionadas atendiendo al cumplimiento de los derechos que preservamos en esta web.</p>


                <h1 className="heading1" id="cookies">Política de cookies</h1>
                <p>MAGMA COMUNICACIÓN S. COOP desea informarle que esta página web emplea cookies propias y de terceros para mejorar la experiencia del usuario mediante el análisis de sus hábitos de navegación. Además, compartimos la información sobre el uso que hace de nuestra web con Google, quien puede combinarla con otra información que le haya proporcionado o que haya recopilado a partir del uso que haya hecho de sus servicios.</p>

                <p>La aceptación de la presente Política implica que el usuario ha sido informado de forma clara y completa sobre el uso de dispositivos de almacenamiento y recuperación de datos (cookies) así como que &nbsp;MAGMA COMUNICACIÓN S. COOP dispone del consentimiento del usuario para el uso de las mismas en los términos del artículo 22 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSICE).</p>

                <h3><strong>1. ¿Qué es una cookie y para qué sirve?</strong></h3>

                <p>Una cookie es un fichero que se descarga en su ordenador, smartphone, tablet, etc. al acceder a determinadas páginas web. Las cookies permiten a una página web, entre otras cosas, almacenar y recuperar información sobre los hábitos de navegación de un usuario o de su equipo y, dependiendo de la información que contengan y de la forma en que utilice su equipo, pueden utilizarse para reconocer al usuario.</p>

                <p>El conjunto de "cookies" de todos nuestros usuarios nos ayuda a mejorar la calidad de nuestra web, permitiéndonos controlar qué páginas son útiles, cuáles no y cuáles son susceptibles de mejora. En ningún caso las cookies podrían dañar tu equipo. Por contra, el que estén activas nos ayuda a identificar y resolver los errores.</p>

                <h3><strong>2. ¿Clasificación de las cookies?</strong></h3>

                <p>Las cookies pueden clasificarse:</p>

                <h4>A. Según la entidad que la gestiona</h4>

                <ul>
                    <li>a) Cookies propias: Son aquellas que se envían a tu equipo desde nuestros propios equipos o dominios y desde el que prestamos el servicio que nos solicitas.</li>
                    <li>b) Cookies de terceros: Son aquellas que se envían a tu equipo desde un equipo o dominio que no es gestionado por nosotros, sino por otra entidad colaboradora. Como por ejemplo, las usadas por redes sociales.</li>
                </ul>

                <h4>B. Según el plazo de tiempo que permanecen activadas</h4>

                <ul>
                    <li>a) Cookies de sesión: Son cookies temporales que permanecen en el archivo de cookies de tu navegador hasta que abandonas la página web, por lo que ninguna queda registrada en el disco duro de tu ordenador. La información obtenida por medio de estas cookies, sirven para analizar pautas de tráfico en la web.</li>
                    <li>b) Cookies persistentes: son almacenadas en el disco duro y nuestra web las lee cada vez que realizas una nueva visita. Una cookie permanente posee una fecha de expiración determinada. La cookie dejará de funcionar después de esa fecha.</li>
                </ul>

                <h4>C. Según su finalidad</h4>

                <ul>
                    <li>a) Cookies técnicas: Son aquellas necesarias para la navegación y el buen funcionamiento de nuestra página web. Permiten por ejemplo, controlar el tráfico y la comunicación de datos, o compartir contenidos a través de redes sociales.</li>
                    <li>b) Cookies de personalización: Son aquéllas que te permiten acceder al servicio con unas características predefinidas en función de una serie de criterios, como por ejemplo el idioma, el tipo de navegador a través del cual se accede al servicio, la configuración regional desde donde se accede al servicio, etc.</li>
                    <li>c) Cookies de análisis: Son aquéllas que nos permiten cuantificar el número de usuarios y así realizar la medición y análisis estadístico de la utilización que hacen los usuarios de los servicios prestados.</li>
                    <li>d) Cookies publicitarias: Son aquéllas que permiten la gestión, de la forma más eficaz posible, de los espacios publicitarios que se pudieran incluir en nuestra página web.</li>
                    <li>e) Cookies de publicidad comportamental: Estas cookies almacenan información del comportamiento de los usuarios obtenida a través de la observación continuada. Gracias a ellas, podemos conocer los hábitos de navegación en internet y mostrarte publicidad relacionada con tu perfil de navegación.</li>
                </ul>

                <h3>3. Cookies que usamos en la web www.MYMOOD.com</h3>

                <p>En cumplimiento con lo establecido en el artículo 22.2 de la Ley de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI) y en adecuación con la Directiva Europea 2009/136/CE, &nbsp;MAGMA COMUNICACIÓN S. COOP le informa y usted presta su consentimiento para la utilización de cookies en nuestra web por la mera navegación por la misma.</p>

                <h4>A. Cookies Analíticas</h4>

                <p>En primer lugar le informamos que empleamos cookies de análisis. La aplicación que utilizamos para obtener y analizar la información de la navegación es: Google Analytics: www.google.com/analytics/ que es un servicio prestado por Google Inc, un compañía de Delaware cuya oficina principal está en 1600 Amphitheatre Parkway, Mountain View (California), CA 94043, Estados Unidos (“Google”).</p>

                <p>Google Analytics utiliza "cookies", que son archivos de texto ubicados en su ordenador, para ayudar al website a analizar el uso que hacen los usuarios del sitio web. La información que genera la cookie acerca de su uso del website (incluyendo su dirección IP) será directamente transmitida y archivada por Google en sus servidores. Google usará esta información por cuenta nuestra con el propósito de seguir la pista de su uso del website, recopilando informes de la actividad del website y prestando otros servicios relacionados con la actividad del website y el uso de Internet. Google podrá transmitir dicha información a terceros cuando así se lo requiera la legislación, o cuando dichos terceros procesen la información por cuenta de Google. Google no asociará su dirección IP con ningún otro dato del que disponga Google.</p>

                <p>Google Analytics es una herramienta sencilla y fácil de usar que ayuda a los propietarios de sitios web a medir cómo interactúan los usuarios con el contenido del sitio. Cuando un usuario navega por las páginas de un sitio web, Google Analytics proporciona al propietario de dicho sitio etiquetas JavaScript (bibliotecas) para registrar la información sobre la página que ha visto un usuario, por ejemplo, la URL de la página. Las bibliotecas JavaScript de Google Analytics usan cookies HTTP para "recordar" lo que ha hecho un usuario en páginas o en interacciones con el sitio web anteriores.</p>

                <p>Google Analytics admite dos bibliotecas JavaScript (etiquetas) para medir el uso de los sitios web: analytics.js y ga.js.</p>

                <p>La biblioteca JavaScript analytics.js forma parte de Universal Analytics y usa una sola cookie propia para:</p>

                <ul>
                    <li>Distinguir a los usuarios únicos</li>
                    <li>Limitar el porcentaje de solicitudes</li>
                </ul>

                <p>Cuando se usa el fragmento recommended JavaScript recomendado, analytics.js configura las cookies en el dominio del nivel más alto que puede. Configurar las cookies en el dominio de nivel más alto posible permite realizar el seguimiento de los usuarios en varios subdominios sin agregar configuración adicional.</p>

                <p>analytics.js configura las cookies siguientes:</p>

                <h4>B. Cookies publicitarias</h4>

                <p>Además de estas cookies empleamos cookies publicitarias de Google instaladas por la aplicación Google Maps ®, con la que se permite visualizar la ubicación geográfica de nuestra empresa. Cuando usted accede a la pestaña de “Contacto” de nuestra web Google le instala este tipo de cookies. Google utiliza cookies, como NID u OGP, para poder personalizar los anuncios que se muestran en los servicios de Google. Google utiliza esas cookies, por ejemplo, para recordarle sus búsquedas más recientes, sus interacciones anteriores con los resultados de búsqueda o con la publicidad de un anunciante y sus visitas al sitio web de un anunciante. De ese modo, Google puede mostrarle anuncios personalizados. Estas cookies son enteramente gestionadas por Google. La información sobre su uso en nuestro sitio web, incluyendo su dirección IP, puede ser transmitida a Google y almacenada en sus servidores, si bien, ello no le identifica personalmente a menos que usted haya iniciado sesión en Google, en cuyo caso está vinculado a su cuenta de Google. Si usted no desea que los datos sobre su sesión sean recopilados por este sitio web, modifique las opciones de seguridad y privacidad de su navegador, como indicamos más adelante en el apartado 4 de la presente política de cookies.</p>

                <h4>C. Cookies de Youtube</h4>

                <p>En nuestra sección “Actualidad”, en nuestro post “Conseguir la excelencia sin red comercial propia”, usted podrá ver un vídeo alojados en el proveedor de videos en streaming Youtube ® de la compañía Youtube LLC, compañía domiciliada en el número 901 de Cherri Avenue, San Bruno, California, CA 94066, Estados Unidos, incluida dentro del grupo empresarial de Google. Al acceder a esta sección de nuestra web y reproducir el vídeo se le instalaran las cookies de Youtube ®. Google establece un número de cookies en cualquier página que incluye un video de Youtube. Dado que son cookies de tercero, &nbsp;MAGMA COMUNICACIÓN S. COOP no tiene control sobre las cookies de Google, que incluyen una mezcla de fragmentos de información para medir el número y el comportamiento de los usuarios de Youtube, incluida la información que vincule sus visitas a nuestro sitio web con su cuenta de Google si se ha identificado el usuario con su cuenta google. La información sobre su uso en nuestro sitio web, incluyendo su dirección IP, puede ser transmitida a Google y almacenada en sus servidores, si bien, ello no le identifica personalmente a menos que usted haya iniciado sesión en Google, en cuyo caso está vinculado a su cuenta de Google.</p>

                <p>Además, al reproducir el vídeo Google instala otras cookies publicitarias denominadas "id", “DSID” e “IDE” que se almacenan en el dominio doubleclick.net cuyo objetivo es mostrarle anuncios relacionados con las preferencias de su navegación.</p>

                <p>Si usted no desea que los datos sobre su sesión sean recopilados por este sitio web, modifique las opciones de seguridad y privacidad de su navegador, como indicamos más adelante en el apartado 4 de la presente política de cookies.</p>

                <h4>D. Cookies usadas por redes sociales</h4>

                <p>En tercer lugar, empleamos cookies de complemento (plug-in) para intercambiar contenido de en redes sociales como Facebook®. Si pincha con su ratón en los iconos de estas redes sociales, podrá acceder a nuestra página en las mismas y acceder a la información que compartimos. Estos complementos almacenan y acceden a cookies en el equipo terminal usuario que permiten a la red social identificar a sus miembros mientras estos interactúan con los complementos. Por ello debe usted saber que si navega por nuestra página estando identificado en la correspondiente red social tiene que tener en cuenta que, si comparte contenido de esta web con amigos a través de la red social, o publica contenido en nuestra página de dichas redes sociales, recibirá cookies de esos sitios web. No podemos controlar los ajustes de las cookies de terceros, por lo que le sugerimos que compruebe los sitios web de dichos terceros para obtener más información sobre sus cookies y cómo gestionarlas.</p>

                <ul>
                    <li><a href="https://www.facebook.com/policies/cookies/" target="_blank">Política de cookies Facebook</a></li>
                </ul>

                <h4>E. Cookies de uso interno</h4>

                <p>Finalmente, este sitio web emplea cookies técnicas para el funcionamiento de la web, concretamente para determinar si el usuario ha aceptado el uso de cookies.</p>

                <h3>4. ¿Cómo puedo configurar o deshabilitar las cookies?</h3>

                <p>Para permitir, conocer, bloquear o eliminar las cookies instaladas en tu equipo puedes hacerlo mediante la configuración de las opciones del navegador instalado en su ordenador. Por ejemplo puedes encontrar información sobre cómo hacerlo en el caso que uses como navegador:</p>

                <ul>
                    <li>Firefox: <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias?redirectlocale=es&amp;redirectslug=habilitar-y-deshabilitar-cookies-que-los-sitios-we" target="_blank">aquí</a></li>
                    <li>Chrome: <a href="https://support.google.com/chrome/answer/95647?hl=es" target="_blank">aquí</a></li>
                    <li>Explorer: <a href="https://support.microsoft.com/es-es/products/windows?os=windows-10" target="_blank">aquí</a></li>
                    <li>Safari: <a href="https://support.apple.com/kb/ph5042?locale=es_ES" target="_blank">aquí</a></li>
                    <li>Safari para IOs: <a href="https://support.apple.com/es-es/HT201265" target="_blank">aquí</a></li>
                    <li>Chrome para Android: <a href="https://support.google.com/chrome/answer/114662?hl=es&amp;visit_id=undefined&amp;rd=1" target="_blank">aquí</a></li>
                </ul>

                <p>&nbsp;MAGMA COMUNICACIÓN S. COOP se exonera de responsabilidad del uso y finalidades que pueda realizar Google Inc. sobre los datos obtenidos mediante este proceso. Puede consultar la política de privacidad de Google en el siguiente enlace <a href="https://www.google.es/intl/es/policies/privacy/" target="_blank">https://www.google.es/intl/es/policies/privacy/</a>. Por otra parte, si quieres no ser rastreado por Google Analytics a través de todas las páginas web, ve al siguiente link: <a href="http://tools.google.com/dlpage/gaoptout" target="_blank">http://tools.google.com/dlpage/gaoptout</a></p>

                <p>Si necesita mayor información acerca del funcionamiento de las cookies, así como la forma de eliminarlas, puede dirigirte a los siguientes enlaces:</p>

                <ul>
                    <li>Entrada en la Wikipedia sobre las cookies.</li>
                    <li>Documento técnico explicativo sobre las cookies (página en inglés)</li>
                    <li><a href="http://www.allaboutcookies.org" target="_blank">www.allaboutcookies.org</a> (página en inglés)</li>
                </ul>

                <p>&nbsp;</p>


            </div>
            </Container>
        </Container >
    );
};
