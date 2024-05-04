import click
from .models import db, User, Location, Hobbie, Mood, UserMoodHistory, CategoryMood, Action, ResourceType, Resource, Chat, Psychologist, Sessions
from datetime import datetime, date, timedelta
import bcrypt
import random

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users") # name of our command
    @click.argument("count") # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        pass
    

    @app.cli.command("fill-db")
    def fill_db():
        """ Este comando rellenará la base de datos con datos de ejemplo. """


        db.drop_all()
        db.create_all()

        try:
            
            locations = [
                Location(latitude=40.4214, longitude=-3.6903), #(Gran Vía)
                Location(latitude=40.4238, longitude=-3.6932), #(Plaza de España)
                Location(latitude=40.4180, longitude=-3.6994), #(Puerta de Alcalá)
                Location(latitude=40.4265, longitude=-3.6919), #(Cibeles Fountain)
                Location(latitude=40.4109, longitude=-3.6925), #(CaixaForum Madrid)
                Location(latitude=40.4161, longitude=-3.6976), #(Plaza de Cibeles)
                Location(latitude=40.4123, longitude=-3.6949), #(Puerta del Príncipe - Parque del Retiro)
                Location(latitude=40.4203, longitude=-3.7068), #(Plaza de Colón)
                Location(latitude=40.4121, longitude=-3.6983), #(Banco de España)
                Location(latitude=40.4289, longitude=-3.6958), #(Chueca)
                Location(latitude=40.4219, longitude=-3.6888), #(Malasaña)
                Location(latitude=40.4209, longitude=-3.7044), #(Barrio de las Letras)
                Location(latitude=40.4162, longitude=-3.7058), #(CentroCentro - Palacio de Cibeles)
                Location(latitude=40.4132, longitude=-3.7001), #(Círculo de Bellas Artes)
                Location(latitude=40.4211, longitude=-3.7072), #(Museo Thyssen-Bornemisza)
                Location(latitude=40.4116, longitude=-3.7010), #(Museo Nacional Centro de Arte Reina Sofía)
                Location(latitude=40.4110, longitude=-3.6937), #(Real Jardín Botánico)
                Location(latitude=40.4163, longitude=-3.6945), #(Paseo del Prado)
                Location(latitude=40.4150, longitude=-3.7076), #(Puerta del Sol - Kilómetro Cero)
                Location(latitude=40.4155, longitude=-3.7069), #(Casa de Correos - Reloj de la Puerta del Sol)
                Location(latitude=40.4192, longitude=-3.6949), #(Teatro Real)
                Location(latitude=40.4144, longitude=-3.6935), #(Palacio de Linares)
                Location(latitude=40.4205, longitude=-3.7076), #(Congreso de los Diputados)
                Location(latitude=40.4103, longitude=-3.6937), #(Real Academia de Bellas Artes de San Fernando)
                        ]
            db.session.add_all(locations)
            db.session.commit() 

            categories = [
                CategoryMood(category="Normal", description="Estado de equilibrio emocional, bienestar, o satisfacción con la vida y las circunstancias actuales.", 
                            icon_url="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Final%20Icons%2Flevel-0.png?alt=media&token=966182fb-4544-4bb1-9164-85f8986ecc69"),
                CategoryMood(category="Leve", description="Estado de malestar o incomodidad que son más bien situacionales y no indican un patrón constante de pensamiento negativo.", 
                            icon_url="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Final%20Icons%2Flevel-1.png?alt=media&token=7a469bcb-505f-4b9e-82d0-2d8471768317"),
                CategoryMood(category="Moderado", description="Estado de ansiedad o tristeza que muestran un nivel de afectación personal más profundo, pero todavía gestionable en muchos casos.", 
                            icon_url="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Final%20Icons%2Flevel-2.png?alt=media&token=679901b2-846a-4c8b-bbd3-f1b188bf493e"),
                CategoryMood(category="Severo", description="Estados que indican una lucha significativa con pensamientos negativos, donde la capacidad de funcionar en la vida diaria está claramente afectada.", 
                            icon_url="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Final%20Icons%2Flevel-3.png?alt=media&token=5edf7dcb-6aa3-4782-b52d-4a1a2b274549"),
                CategoryMood(category="Extremo", description="Estados que reflejan pensamientos de desesperanza absoluta, ideación suicida o un estado mental que requiere intervención inmediata.", 
                            icon_url="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Final%20Icons%2Flevel-4.png?alt=media&token=60cdd5e4-7e13-49cb-8e9e-b8b8585be63a")
            ]
            db.session.add_all(categories)
            db.session.commit() 
            
            # Acciones relacionadas con las categorías de estados de ánimo
            all_categories = CategoryMood.query.all()
            if not all_categories:
                print("No categories found. Please load categories first.")
                return

            actions = []

            # Actions for Normal Category
            actions.extend([
                Action(action="Conéctate con amigos", description="Acceso directo para compartir estados o iniciar chats con amigos.", category_id=categories[0].id),
                Action(action="Explora más", description="Enlace a artículos sobre desarrollo personal y bienestar.", category_id=categories[0].id),
                Action(action="Valora tu día", description="Llamada con un psicologo para evaluar tu situación.", category_id=categories[0].id),
                #Action(action="Regístrate a un evento", description="Sugerencias de eventos locales para promover la socialización.", category_id=categories[0].id),
            ])

            # Actions for Leve Category
            actions.extend([
                Action(action="Habla con alguien", description="Enlace a un chat grupal o foro de la comunidad.", category_id=categories[1].id),
                Action(action="Toma un respiro", description="Ejercicios de respiración y relajación.", category_id=categories[1].id),
                Action(action="Escucha a tu terapeuta", description="Contacto con un psicologo", category_id=categories[1].id),
                #Action(action="Levántate y muévete", description="Incentivos para hacer una pequeña actividad física.", category_id=categories[1].id),
            ])

            # Actions for Moderado Category
            actions.extend([
                Action(action="Únete a un grupo de apoyo", description="Enlace a grupos de soporte en línea.", category_id=categories[2].id),
                Action(action="Explora tus emociones", description="Guías para entender mejor tus sentimientos.", category_id=categories[2].id),
                Action(action="Busca soporte", description="Acceso a una lista de terapeutas y consejeros.", category_id=categories[2].id),
                #Action(action="Meditación guiada", description="Sesiones de meditación para aliviar la ansiedad.", category_id=categories[2].id),
            ])

            # Actions for Severo Category
            actions.extend([
                Action(action="Se sienten como yo", description="Botón que te conecta con gente como tú.", category_id=categories[3].id),
                Action(action="Técnicas de manejo del estrés", description="Consejos y técnicas para gestionar el estrés.", category_id=categories[3].id),
                Action(action="Habla con un experto ahora", description="Botón de contacto directo con un psicólogo.", category_id=categories[3].id),
                #Action(action="Historias de éxito", description="Testimonios de personas que han superado dificultades similares.", category_id=categories[3].id),
            ])

            # Actions for Extremo Category
            actions.extend([
                Action(action="Llama a un amigo", description="Función rápida para contactar a un amigo que esta cerca de ti.", category_id=categories[4].id),
                Action(action="Recuerda esto", description="Mensajes y afirmaciones de esperanza y soporte vital.", category_id=categories[4].id),
                Action(action="Contacto de emergencia", description="Acceso inmediato a consejería de emergencia.", category_id=categories[4].id),
                #Action(action="¿Un podcast de autoayuda?", description="Botón para escuchar un podcast de autoayuda.", category_id=categories[4].id),
            ])

            # Add all actions to the session and commit
            db.session.add_all(actions)
            db.session.commit()
                        
            # Primero definimos todas las frases de estado de ánimo por categoría
            moods = []
            mood_descriptions_and_responses = [
                ("Normal", [
                    ("Hoy me siento con las pilas puestas.", "¡Esa es la actitud! Aprovecha esa energía al máximo y haz que hoy sea inolvidable."),
                    ("Todo marchando según el plan, ¿estoy soñando?", "¡Disfruta de este momento de serenidad y orden! No todos los días se sienten como un sueño cumplido."),
                    ("Contento con el rumbo de las cosas, rareza nivel: unicornio.", "Esos días mágicos son para celebrarlos. ¿Qué tal si te das un pequeño premio porque todo va bien?"),
                    ("Un día normal, nada fuera de lo común.", "A veces, la belleza está en lo cotidiano. Mira a tu alrededor y encuentra algo pequeño que te haga sonreír."),
                    ("En paz con el mundo, espero que dure.", "Ese sentimiento de paz es un tesoro; respira profundo y guarda un poco de esa calma para los días menos tranquilos."),
                    ("Disfrutando de la vida, ¿quién dijo que no se podía?", "¡Exacto! La vida está para disfrutarla. Sigue buscando esos momentos que llenan el alma."),
                    ("Optimista hasta más no poder, que venga lo que sea.", "Con esa actitud, estás más que preparado para enfrentar cualquier desafío. ¡Adelante!"),
                    ("Energía al máximo, ¿dónde está la fiesta?", "Tu energía es contagiosa. Comparte esa vibra positiva con los demás, y la fiesta te encontrará a ti."),
                    ("Todo bajo control, por ahora...", "Aprovecha esta tranquilidad para relajarte un poco. Estar preparado es bueno, pero recuerda tomarte un respiro."),
                    ("Satisfecho con mi situación, ¡vamos por más!", "Ese sentimiento de satisfacción es una base sólida para alcanzar nuevas metas. ¡Sigue así!")
                ]),
                ("Leve", [
                    ("Hoy todo me parece un montón, ¿más café tal vez?", "Un café puede ser un buen comienzo. Y recuerda, está bien pedir ayuda si sientes que la carga es demasiada."),
                    ("No estoy seguro de cómo manejar esto, ¿algún voluntario?", "Pedir ayuda es signo de fortaleza, no de debilidad. Estamos más conectados cuando compartimos nuestras luchas."),
                    ("Cansado... y eso que el día apenas comienza.", "Intenta tomarlo con calma y haz pequeñas pausas durante el día. La energía a veces viene en oleadas."),
                    ("Ya quiero que sea fin de semana, ¿alguien más?", "Piensa en ello como en la cuenta regresiva para algo maravilloso. El fin de semana está cerca, ¡aguanta un poco más!"),
                    ("Esto de ser adulto no es como lo pintan.", "Ser adulto tiene sus retos, pero también sus recompensas. Encuentra algo que disfrutes y date ese gusto."),
                    ("Frustrado con las pequeñas cosas, típico.", "Toma un respiro y trata de ver el problema desde otra perspectiva. A veces, un pequeño cambio de enfoque puede hacer una gran diferencia."),
                    ("Un poco nervioso con lo que viene, cruzando dedos.", "Es natural sentir nervios ante lo desconocido, pero confía en ti mismo y en tu capacidad para enfrentar lo que venga."),
                    ("Esperando mejoras como quien espera el estreno de su serie favorita.", "La anticipación puede ser dulce. Mientras tanto, encuentra placer en las pequeñas cosas que te rodean cada día."),
                    ("No veo el final de mis pendientes, ¿será eterno?", "Cada cosa a su tiempo. Divide tus tareas en partes más pequeñas y manejables, y celebra cada pequeño logro."),
                    ("Sintiéndome solo, ¿hola, eco?", "Sentirse solo puede ser duro, pero también es una oportunidad para reconectarte contigo mismo. Además, nunca está de más alcanzar a otros y compartir cómo te sientes.")
                ]),
                ("Moderado", [
                    ("Siento que todo me supera, ¿dónde está el botón de pausa?", "Es completamente válido sentirse abrumado. Tomarte un momento para pausar y respirar profundamente puede ayudar mucho."),
                    ("Levantarse de la cama es la misión más difícil.", "Hay días en los que levantarse es una gran victoria. Reconoce tu esfuerzo, y toma el día paso a paso."),
                    ("Pensando en lo peor, pero esperando lo mejor.", "Es humano preocuparse, pero intenta equilibrar esos pensamientos con esperanza y acciones positivas."),
                    ("¿Alguien más se siente incomprendido?", "No estás solo en sentirte así. Expresar tus sentimientos y buscar comprensión puede aliviar ese peso."),
                    ("Perdiendo interés... ni las series me animan.", "Cuando las cosas habituales ya no te entusiasman, podría ser tiempo de explorar nuevos intereses. ¿Qué tal algo completamente diferente?"),
                    ("Atrapado en mi rutina, send help.", "Romper la rutina puede ser liberador. Intenta algo nuevo hoy, aunque sea pequeño, para ver el mundo con otros ojos."),
                    ("Todo es un desafío, incluso lo más simple.", "Afrontar desafíos constantes es agotador. Asegúrate de cuidar tu bienestar físico y emocional para mantener tu resiliencia."),
                    ("A veces, simplemente quiero desaparecer.", "Sentirse así es serio y es importante hablarlo. Hablar con alguien de confianza puede brindarte apoyo y perspectiva."),
                    ("Vacío por dentro, como mi nevera en fin de mes.", "Ese sentimiento de vacío es difícil, pero también es un llamado a rellenar tu vida con cosas que te aporten significado."),
                    ("Mi vida parece un GPS sin señal, sin dirección.", "Es normal sentirse perdido de vez en cuando. Considera este momento como una oportunidad para reevaluar y ajustar tu rumbo.")
                ]),
                ("Severo", [
                    ("Sin salida visible, ¿alguien ve la luz?", "Aunque ahora parezca oscuro, siempre hay una luz, aunque no la veamos. Hablar con alguien puede ayudarte a encontrarla."),
                    ("Obsesionado con mis errores, playlist triste en repeat.", "Reconocer que te duele es el primer paso para sanar. Perdonarte a ti mismo es tan importante como aprender de los errores."),
                    ("Viviendo con miedo, y no precisamente a las películas de terror.", "Es difícil, pero enfrentar tus miedos poco a poco te puede ayudar a superarlos. Considera buscar apoyo profesional si es demasiado para manejar solo."),
                    ("Mi vida es un caos de esos que no se ordenan ni con tutorial de YouTube.", "A veces necesitamos ayuda externa para desenredar el caos. No hay vergüenza en buscar asesoramiento o terapia."),
                    ("Solo, como el '1' en el día del amigo.", "Sentirse solo duele profundamente, pero recuerda que mereces conexión y cariño. Alcanza a otros, a menudo se sentirán halagados de saber que los necesitas."),
                    ("Tristeza profunda diaria, necesito un cambio de canal.", "Cuando la tristeza se vuelve un canal constante, es tiempo de buscar ayuda para cambiarlo. Habla con un profesional que pueda ofrecerte nuevas perspectivas y herramientas."),
                    ("Mis pensamientos oscuros no me dan tregua.", "Es importante que no enfrentes esos pensamientos solo. Buscar ayuda de un profesional puede ser un paso valiente hacia la luz."),
                    ("Al borde... del próximo capítulo de mi telenovela de drama personal.", "Aunque sientas que estás al borde, cada día te da la oportunidad de comenzar un nuevo capítulo. No tienes que escribirlo solo."),
                    ("Sin energía, incluso el café me falla.", "La falta de energía puede ser desalentadora. Es importante cuidar tu salud física y emocional, y considerar consultar a un profesional si esto persiste."),
                    ("¿Para qué salir de la cama? El suelo está sobrevalorado.", "A veces, el mundo exterior puede esperar. Si sientes que no puedes enfrentarlo, podría ser útil hablar con alguien sobre lo que sientes.")
                ]),
                ("Extremo", [
                    ("No quiero seguir, punto final.", "Sentir que no puedes continuar es una señal de que necesitas apoyo inmediato. Por favor, habla con alguien, un amigo, un familiar o un profesional de inmediato."),
                    ("Mejor sin mí, o eso parece.", "Puede ser difícil ver tu propio valor cuando te sientes así, pero eres importante para más gente de la que crees. Buscar ayuda profesional es un acto de valentía."),
                    ("Sin salidas, en un laberinto sin final.", "Cuando todo parece un laberinto, a veces necesitamos ayuda externa para encontrar la salida. No tienes que hacerlo solo."),
                    ("Pensando en hacerme daño, alerta roja.", "Estos pensamientos son una señal seria para buscar ayuda inmediata. Es crucial que hables con un profesional de la salud mental cuanto antes."),
                    ("Sería mejor no existir, pensamiento recurrente.", "Es muy duro sentir esto, pero tu vida tiene un valor inmenso. Por favor, busca apoyo de amigos, familiares o un profesional."),
                    ("¿Qué sentido tiene seguir? Buscando razones...", "A veces, encontrar un sentido puede ser difícil solo. Hablar con alguien puede ayudarte a ver razones que ahora no puedes."),
                    ("Esto no mejora, cada día más gris.", "Cuando los días se sienten continuamente grises, es importante intervenir con ayuda profesional. Hay técnicas y tratamientos que pueden ayudarte."),
                    ("Cansado de luchar contra viento y marea.", "Luchar solo es agotador. Permitirte recibir ayuda de otros puede darte el respiro que necesitas para continuar."),
                    ("Dudando si podré aguantar otro día más.", "Es muy valiente reconocer esta lucha. Hablar con alguien, especialmente un profesional, puede darte el soporte necesario para seguir adelante."),
                    ("Al final de mi cuerda, literalmente.", "Cuando te sientes al final de tu cuerda, es crucial buscar ayuda de emergencia. Está bien pedir ayuda; es un paso hacia la recuperación.")
                ])
            ]

            for category_name, texts in mood_descriptions_and_responses:
                category = CategoryMood.query.filter_by(category=category_name).first()
                if category:
                    for text, response in texts:
                        mood = Mood(mood=text, category_id=category.id, response=response)
                        moods.append(mood)
            db.session.add_all(moods)
            db.session.commit()

            hobbies_list = [
                "Leer",
                "Escribir",
                "Pintar",
                "Dibujar",
                "Cocinar",
                "Bailar",
                "Hacer senderismo",
                "Jardinería",
                "Practicar yoga",
                "Meditar",
                "Fotografía",
                "Escuchar música",
                "Tocar un instrumento musical",
                "Cantar",
                "Ciclismo",
                "Natación",
                "Ver películas",
                "Tejer",
                "Hacer manualidades",
                "Jugar videojuegos"
            ]

            # Creación de objetos Hobbie para cada hobby en la lista
            hobbies_objects = [Hobbie(name=hobby) for hobby in hobbies_list]

            db.session.add_all(hobbies_objects)
            db.session.commit()
            
            users = [
                User(name="Bárbara", surnames="Puyol", age=30, email="barbara@mymood.com", 
                    password=bcrypt.hashpw("111111".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), 
                    is_active=False, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="barbarapuyol", location_id=5, mood_id=moods[1].id),  

                User(name="Pedro", surnames="Berruezo", age=30, email="pedro@mymood.com", 
                    password=bcrypt.hashpw("222222".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), 
                    is_active=True, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="pedroberruezo", location_id=1, mood_id=moods[5].id),  

                User(name="Natalia", surnames="L. Salas", age=40, email="nat@mymood.com", 
                    password=bcrypt.hashpw("333333".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),  
                    is_active=True, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="natalialsalas", location_id=2, mood_id=moods[10].id),  

                User(name="Natalia", surnames="L. Salas", age=40, email="natalia@funtsak.com", 
                    password=bcrypt.hashpw("444444".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),  
                    is_active=True, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="natalialsalas", location_id=4, mood_id=moods[15].id),

                User(name="Juan", surnames="Gutiérrez", age=25, email="juan@mymood.com",
                    password=bcrypt.hashpw("123456".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                    is_active=True, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="juangutierrez", location_id=3, mood_id=moods[16].id),

                User(name="María", surnames="Sánchez", age=35, email="maria@mymood.com",
                    password=bcrypt.hashpw("abcdef".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), 
                    is_active=False, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="mariasanchez", location_id=6, mood_id=moods[17].id),

                User(name="Luis", surnames="Martínez", age=28, email="luis@mymood.com", 
                    password=bcrypt.hashpw("qwerty".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                    is_active=True, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="luismartinez", location_id=7, mood_id=moods[21].id),
                
                User(name="Ana", surnames="Hernández", age=42, email="ana@mymood.com", 
                    password=bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                    is_active=False, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="anahernandez", location_id=8, mood_id=moods[25].id),
                
                User(name="Carlos", surnames="Díaz", age=31, email="carlos@mymood.com", 
                    password=bcrypt.hashpw("abc123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                    is_active=True, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="carlosdiaz", location_id=9, mood_id=moods[26].id),
                
                User(name="Laura", surnames="Fernández", age=29, email="laura@mymood.com", 
                    password=bcrypt.hashpw("password456".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                    is_active=False, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="laurafernandez", location_id=10, mood_id=moods[28].id),
                
                User(name="Javier", surnames="López", age=37, email="javier@mymood.com", 
                    password=bcrypt.hashpw("123abc".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                    is_active=True, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="javierlopez", location_id=11, mood_id=moods[30].id),
                
                User(name="Marta", surnames="Gómez", age=24, email="marta@mymood.com", 
                    password=bcrypt.hashpw("password789".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                    is_active=False, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="martagomez", location_id=12, mood_id=moods[32].id),
                
                User(name="Daniel", surnames="Rodríguez", age=33, email="daniel@mymood.com", 
                    password=bcrypt.hashpw("password1234".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                    is_active=True, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="danielrodriguez", location_id=13, mood_id=moods[35].id),
                
                User(name="Sara", surnames="Martín", age=27, email="sara@mymood.com", 
                    password=bcrypt.hashpw("abc456".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                    is_active=False, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="saramartin", location_id=14, mood_id=moods[36].id),
                
                User(name="Pablo", surnames="Pérez", age=38, email="pablo@mymood.com", 
                    password=bcrypt.hashpw("123456abc".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                    is_active=True, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="pabloperez", location_id=15, mood_id=moods[37].id),
                
                User(name="Elena", surnames="Ruiz", age=26, email="elena@mymood.com", 
                    password=bcrypt.hashpw("password789".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                    is_active=False, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="elenaruiz", location_id=16, mood_id=moods[38].id),
                
                User(name="Adrián", surnames="González", age=29, email="adrian@mymood.com", 
                    password=bcrypt.hashpw("abc123456".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                    is_active=True, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="adriangonzalez", location_id=17, mood_id=moods[16].id),
                
                User(name="Cristina", surnames="Herrera", age=34, email="cristina@mymood.com", 
                    password=bcrypt.hashpw("password123abc".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                    is_active=False, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="cristinaherrera", location_id=18, mood_id=moods[14].id),
                
                User(name="Jorge", surnames="Dominguez", age=32, email="jorge@mymood.com", 
                    password=bcrypt.hashpw("abcdef123456".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                    is_active=True, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="jorgedominguez", location_id=19, mood_id=moods[40].id),
                
                User(name="Alicia", surnames="Muñoz", age=36, email="alicia@mymood.com", 
                    password=bcrypt.hashpw("passwordabc123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                    is_active=False, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="aliciamunoz", location_id=20, mood_id=moods[37].id),
                
                User(name="Roberto", surnames="Alvarez", age=30, email="roberto@mymood.com", 
                    password=bcrypt.hashpw("abcdef123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                    is_active=True, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="robertoalvarez", location_id=21, mood_id=moods[39].id),
                
                User(name="Lucía", surnames="Jiménez", age=28, email="lucia@mymood.com", 
                    password=bcrypt.hashpw("password123456abc".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                    is_active=False, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="luciajimenez", location_id=22, mood_id=moods[38].id),
                
                User(name="Alejandro", surnames="Romero", age=39, email="alejandro@mymood.com", 
                    password=bcrypt.hashpw("abcdef123456abc".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                    is_active=True, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="alejandroromero", location_id=23, mood_id=moods[46].id),
                
                User(name="Raquel", surnames="Santos", age=33, email="raquel@mymood.com", 
                    password=bcrypt.hashpw("passwordabc123456".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                    is_active=False, created_at=date.today(), hobbie_id=random.randint(1, 20), profile_url="raquelsantos", location_id=24, mood_id=moods[49].id),
            ]
            db.session.add_all(users)
            db.session.commit()
            
            psychologists = [
                Psychologist(name="Ana", surnames="Martínez López", email="ana.martinez@example.com", password=bcrypt.hashpw("p111111".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), experience=5, collegiate_number="COL-001", biography="Ana Martínez es una psicóloga especializada en ansiedad y depresión. Con un enfoque empático y personalizado, Ana ayuda a sus pacientes a navegar por los desafíos emocionales y a encontrar estrategias efectivas para mejorar su bienestar emocional.", web="https://anamartineztherapy.com", profile_url="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Psychologists%20profiles%2Fpsychologists-2g.webp?alt=media&token=e17f71cf-a0fa-472d-9c0d-2aec6531c88f"),
                Psychologist(name="Carlos", surnames="García Navarro", email="carlos.garcia@example.com", password=bcrypt.hashpw("p222222".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), experience=3, collegiate_number="COL-002", biography="Carlos García practica la terapia cognitivo conductual, ofreciendo a sus pacientes herramientas para cambiar patrones de pensamiento negativos y comportamientos disruptivos que afectan su vida diaria. Su enfoque es claro y estructurado, buscando resultados medibles y duraderos.", web="https://carlosgarciapsy.com", profile_url="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Psychologists%20profiles%2Fpsychologists-4b.webp?alt=media&token=705227ae-ce77-4b4c-92d0-a24396bfce09"),
                Psychologist(name="Elena", surnames="Ruiz Díaz", email="elena.ruiz@example.com", password=bcrypt.hashpw("p333333".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), experience=8, collegiate_number="COL-003", biography="Elena Ruiz es experta en mindfulness y terapia de pareja. Combina técnicas modernas de atención plena con terapia de conversación para ayudar a las parejas a mejorar su comunicación y a individuos a vivir más presentes y satisfechos con sus vidas.", web="https://elenaruiztherapy.com", profile_url="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Psychologists%20profiles%2Fpsychologists-5g.webp?alt=media&token=1d2d99a0-bfec-4991-b3d6-e8b136425103"),
                Psychologist(name="David", surnames="Jiménez Soto", email="david.jimenez@example.com", password=bcrypt.hashpw("p444444".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), experience=10, collegiate_number="COL-004", biography="David Jiménez es un psicólogo con diez años de experiencia en el manejo de estrés y conflictos laborales. Su práctica se centra en ayudar a profesionales a desarrollar habilidades de manejo de estrés y a encontrar un equilibrio saludable entre el trabajo y la vida personal.", web="https://davidjimenezpsy.com", profile_url="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Psychologists%20profiles%2Fpsychologists-1b.webp?alt=media&token=05bc6a22-e3f8-42d4-9ab5-426a2fe72cb4"),
                Psychologist(name="Laura", surnames="Moreno Casas", email="laura.moreno@example.com", password=bcrypt.hashpw("p555555".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), experience=2, collegiate_number="COL-005", biography="Laura Moreno se especializa en psicología juvenil y escolar, proporcionando apoyo a jóvenes que enfrentan problemas académicos y emocionales. Su enfoque integrativo busca conectar con los estudiantes para fomentar un entorno educativo saludable y positivo.", web="https://lauramoreno.com", profile_url="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Psychologists%20profiles%2Fpsychologists-4g.webp?alt=media&token=1dfe2334-1f82-4cb2-a8d2-2206b027fc31"),
                Psychologist(name="Raúl", surnames="Alvarez Fernández", email="raul.alvarez@example.com", password=bcrypt.hashpw("p666666".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), experience=7, collegiate_number="COL-006", biography="Raúl Alvarez trabaja con atletas y equipos deportivos para mejorar su rendimiento a través de la psicología deportiva. Utilizando técnicas de psicología positiva, Raúl ayuda a sus clientes a alcanzar sus máximos potenciales mientras mantienen una actitud mental fuerte y saludable.", web="https://raulalvarezsports.com", profile_url="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Psychologists%20profiles%2Fpsychologists-6b.webp?alt=media&token=6b70f198-dbf3-4621-8575-f12aa6671bfc"),
                Psychologist(name="Sofía", surnames="Pérez Gómez", email="sofia.perez@example.com", password=bcrypt.hashpw("p777777".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), experience=9, collegiate_number="COL-007", biography="Sofía Pérez ofrece terapias alternativas y holísticas, integrando métodos tradicionales y modernos para tratar el bienestar emocional de sus pacientes. Su práctica está dedicada a aquellos que buscan un enfoque más natural y holístico para la salud mental.", web="https://sofiapereztherapy.com", profile_url="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Psychologists%20profiles%2Fpsychologists-1g.webp?alt=media&token=1029a729-3abe-4175-b084-30f453c2bc50"),
                Psychologist(name="Marcos", surnames="Vidal Lozano", email="marcos.vidal@example.com", password=bcrypt.hashpw("p888888".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), experience=4, collegiate_number="COL-008", biography="Marcos Vidal es un terapeuta familiar que utiliza un enfoque integrativo para ayudar a las familias a resolver conflictos internos y a mejorar sus relaciones interpersonales. Su trabajo está basado en la comprensión y el respeto mutuo, promoviendo un ambiente familiar saludable.", web="https://marcosvidaltherapy.com", profile_url="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Psychologists%20profiles%2Fpsychologists-2b.webp?alt=media&token=5f339483-fd1f-42e2-bb98-829ecab0c285"),
                Psychologist(name="Julia", surnames="Ortiz Castillo", email="julia.ortiz@example.com", password=bcrypt.hashpw("p999999".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), experience=6, collegiate_number="COL-009", biography="Julia Ortiz ha dedicado su carrera a trabajar con individuos que sufren trastornos de la alimentación. Su enfoque compasivo y basado en la evidencia proporciona a sus pacientes las herramientas necesarias para reconstruir una relación saludable con la comida y con sus cuerpos.", web="https://juliaortiz.com", profile_url="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Psychologists%20profiles%2Fpsychologists-3g.webp?alt=media&token=52c1d9a7-569b-44e0-8fe0-ccfa0846ae3b"),
                Psychologist(name="Fernando", surnames="Morales Cruz", email="fernando.morales@example.com", password=bcrypt.hashpw("p101010".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), experience=12, collegiate_number="COL-010", biography="Con más de una década de experiencia, Fernando Morales es un experto en trastornos de personalidad. Su metodología clínica busca entender profundamente las complejidades de sus pacientes y desarrollar estrategias personalizadas de tratamiento.", web="https://fernandomoralespsy.com", profile_url="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Psychologists%20profiles%2Fpsychologists-3b.webp?alt=media&token=9397bdab-b117-4f8b-bf67-c135cb14aa8b"),
                Psychologist(name="Irene", surnames="Gil Martín", email="irene.gil@example.com", password=bcrypt.hashpw("p111111".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), experience=11, collegiate_number="COL-011", biography="Irene Gil es conocida por su trabajo en psicología infantil, ayudando a niños y a sus familias a superar desafíos de aprendizaje y desarrollo emocional. Su enfoque es cálido y acogedor, creando un espacio seguro para que los niños exploren sus emociones.", web="https://irenepsychology.com", profile_url="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Psychologists%20profiles%2Fpsychologists-4g.webp?alt=media&token=1dfe2334-1f82-4cb2-a8d2-2206b027fc31"),
                Psychologist(name="Óscar", surnames="Sánchez Rey", email="oscar.sanchez@example.com", password=bcrypt.hashpw("p121212".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), experience=5, collegiate_number="COL-012", biography="Óscar Sánchez se especializa en orientación vocacional, ayudando a jóvenes y adultos a encontrar sus caminos profesionales mediante técnicas de coaching y asesoramiento psicológico. Su objetivo es clarificar vocaciones y maximizar el potencial profesional de sus clientes.", web="https://oscarsancheztherapy.com", profile_url="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Psychologists%20profiles%2Fpsychologists-profile.webp?alt=media&token=2363922b-b6ca-451d-be3f-197185a61beb"),
                Psychologist(name="Teresa", surnames="González Luna", email="teresa.gonzalez@example.com", password=bcrypt.hashpw("p131313".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), experience=15, collegiate_number="COL-013", biography="Teresa González tiene una amplia experiencia en psicología geriátrica, dedicándose a mejorar la calidad de vida de los ancianos. Su práctica se centra en abordar las preocupaciones emocionales y cognitivas asociadas con el envejecimiento, ofreciendo apoyo y comprensión.", web="https://teresagonzalez.com", profile_url="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Psychologists%20profiles%2Fpsychologists-profile.webp?alt=media&token=2363922b-b6ca-451d-be3f-197185a61beb")
            ]
            db.session.add_all(psychologists)
            db.session.commit()

            resource_types = [
                ResourceType(resource_type="Artículo", icon_url="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Final%20Icons%2Farticle.png?alt=media&token=c7baed85-7d3b-4f7a-abd2-f47bbea5a372"),
                ResourceType(resource_type="Vídeo", icon_url="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Final%20Icons%2Fvideo.png?alt=media&token=21e95df2-7c85-4df1-a08e-848f2ef1ddf9"),
                ResourceType(resource_type="Podcast", icon_url="https://firebasestorage.googleapis.com/v0/b/my-mood-507ca.appspot.com/o/Final%20Icons%2Fpodcast.png?alt=media&token=d0ea6e38-b4a2-4816-8488-1a4e99de627e")
            ]
            db.session.add_all(resource_types)
            db.session.commit()  
            
            #añadimos recursos a la base de datos
            # Creando diferentes timestamps para cada recurso para mostrar variedad en los "últimos añadidos"
            base_time = datetime.now()

            podcasts = [
                Resource(resource_type_id=3, url="https://open.spotify.com/episode/5IAG7ZF1nCbOkt4ZA1oTI3?si=-x3K03_FQpKx08Eh6fkARg&nd=1&dlsi=9c3eb03c72674e35", 
                        title="Que hacer cuando estás mal y no saber por qué", 
                        description=" ¿Alguna vez has sentido que no estabas mal, pero aun así sabías que algo en ti no estaba del todo bien? ¿O te has sentido mal sin saber por qué? ❤️‍🩹", 
                        psychologist_id=1, created_at=base_time - timedelta(days=2)),
                
                Resource(resource_type_id=3, url="https://open.spotify.com/episode/3Vvbey5T3aLEARiGnQBCSI?go=1&sp_cid=f9474c4b16f6226cda32cd6db5aab82a&utm_source=embed_player_p&utm_medium=desktop&nd=1&dlsi=80d5e71d3d19434b",
                        title="¿Hasta qué punto dependemos de los demás?", description="Y las relaciones que establecemos con nuestro entorno nos influyen de manera directa en la forma en la que construimos nuestra identidad, nuestra forma de ser y estar en el mundo.",
                        psychologist_id=2, created_at=base_time - timedelta(days=3)),

                Resource(resource_type_id=3, url="https://open.spotify.com/episode/4Uz2UreQ5F7U8ShQ4hicJQ?si=1epGRhFoSmO93L5gS17E9A",
                        title="El peligro de la Hiperempatía", description="La empatía nos conecta con los demás de tal manera, que somos capaces de estar en el mismo estado psicológico. Es como si por un momento, fuéramos la misma persona.",
                        psychologist_id=3, created_at=base_time - timedelta(days=5)),

                Resource(resource_type_id=3, url="https://open.spotify.com/episode/1PbGUlEn16dJWstkB1zbpI",
                        title="Memento Mori: La importancia de recordar la muerte", description="¿Cuáles son las actitudes que tenemos los seres humanos ante la muerte? ¿Por qué nos genera sufrimiento la idea de morir a pesar de ser algo inevitable?",
                        psychologist_id=4, created_at=base_time - timedelta(days=1)),
                
                Resource(resource_type_id=3, url="https://open.spotify.com/episode/4gZO6dHCP7W7KTRY7qTnhO",
                        title="Psicología del Perdoón", description="Entendemos por qué el perdón en algunas ocasiones no es realmente bueno y tenemos 5 estrategias para que, si así lo decidas, atravesar el proceso del perdón y lograr perdonar de manera salud.",
                        psychologist_id=5, created_at=base_time - timedelta(days=4)),

                Resource(resource_type_id=3, url="https://open.spotify.com/episode/60dxU7qrtS66hobKZoH7aK",
                        title="¿Hablamos de salud mental?", description="Después de la pandemia, no paramos de escuchar: “hay que cuidar la salud mental” y es cierto.",
                        psychologist_id=11, created_at=base_time - timedelta(days=7)),

                Resource(resource_type_id=3, url="https://podcasts.apple.com/es/podcast/t%C3%A9cnicas-de-autocontrol/id1501727318?i=1000648060622",
                        title="Técnicas de autocontrol", description="Las emociones no son ni buenas ni malas. No ponemos en duda que puedan clasificarse entre agradables o desagradables, pero todas, en su justa medida, son, han sido y serán, necesarias para la supervivencia",
                        psychologist_id=12, created_at=base_time - timedelta(days=10)),


            
            ]
            db.session.add_all(podcasts)
            db.session.commit()

            videos = [
                Resource(resource_type_id=2, url="https://www.youtube.com/watch?v=ivUFUEC5zQI", title="¿A quién le importa la salud mental?", description="Pero, ¿cómo es el día a día de una persona con un problema de salud mental grave? ¿y el de su familia? ¿a quién puede interesarle?", psychologist_id=6, created_at=datetime.now()),
                Resource(resource_type_id=2, url="https://www.youtube.com/watch?v=SNm3w2wJ3KI", title="15 Hábitos para Tener una Salud Mental del 1%", description="¿Cómo podemos reconocer nuestro dolor?", psychologist_id=7, created_at=base_time - timedelta(days=2, hours=2)),
                Resource(resource_type_id=2, url="https://www.youtube.com/watch?v=0noAwrWY78U", title="El cerebro, nuestro mejor aliado contra el estrés.", description="Comprender es aliviar, y cuando comprendes por lo que pasa tu mente, te sientes aliviado; porque si no, eres esclavo de síntomas físicos, psicológicos y vas como perdido por la vida", psychologist_id=8, created_at=base_time - timedelta(days=3, hours=1)),
                Resource(resource_type_id=2, url="https://www.youtube.com/watch?v=5zxQJG1khlc", title="Hablemos de Prevencion del Suicidio", description="Hablar de suicidio debe dejar de ser un tema tabú y debemos comenzar a hablar abiertamente.", psychologist_id=9, created_at=base_time - timedelta(days=4)),
                Resource(resource_type_id=2, url="https://www.youtube.com/watch?v=tuvSOkDmr8o", title="Identifica una relación tóxica", description="Por qué tenemos relaciones tóxicas cuando somos jóvenes?", psychologist_id=10, created_at=base_time - timedelta(days=5, hours=2))
            ]
            db.session.add_all(videos)
            db.session.commit()
            
            articles = [
                Resource(resource_type_id=1, url="https://elpais.com/eps/psicologia-y-bienestar/2024-04-11/y-si-intentaramos-decir-todo-lo-que-pensamos.html", title="¿Y si intentáramos decir todo lo que pensamos?", description="Somos rehenes del lenguaje y su estructura pone límites a nuestra voluntad de expresarnos, pero, a la vez, solo a través de las palabras podemos hablar y liberarnos", psychologist_id=1, created_at=base_time - timedelta(days=1, minutes=30)),
                Resource(resource_type_id=1, url="https://elpais.com/eps/2024-03-21/como-encontrar-tu-proposito-en-la-vida.html", title="Cómo encontrar tu propósito en la vida", description="Es un proceso que empieza por el autoconocimiento, continúa en la exploración y desemboca en el ejercicio de prueba y error", psychologist_id=2, created_at=base_time - timedelta(days=2, minutes=25)),
                Resource(resource_type_id=1, url="https://www.ryapsicologos.net/beneficios-de-la-terapia-de-pareja/", title="8 beneficios de la terapia de pareja", description="¿La terapia de pareja realmente ayuda?", psychologist_id=3, created_at=base_time - timedelta(days=3, minutes=20)),
                Resource(resource_type_id=1, url="https://www.ryapsicologos.net/autoayuda/emociones-negativas/", title="Emociones negativas", description="Las emociones negativas no son malas en sí mismas, sino en tanto que se entronicen o tiranicen, por decirlo así, e impidan el paso de emociones positivas.", psychologist_id=4, created_at=base_time - timedelta(days=4, minutes=15)),
                Resource(resource_type_id=1, url="https://www.mundopsicologos.com/articulos/depresion-laboral-por-que-surge-y-como-podemos-manejarla", title="Depresión laboral: ¿Por qué surge y cómo podemos manejarla?", description="La depresión por el trabajo es cada vez una realidad que afecta a más personas. Pero, ¿cuáles son los síntomas que pueden indicar que estás padeciendo de ellos? y, ¿qué puedes hacer para afrontarla?", psychologist_id=5, created_at=base_time - timedelta(days=5, minutes=10)),
                Resource(resource_type_id=1, url="https://www.mundopsicologos.com/articulos/no-puedo-mas-estoy-al-limite-que-hacer-cuando-nos-sentimos-abrumados", title="¿Qué hacer cuando nos sentimos abrumados?", description="¿Sientes que estás en una situación límite o demasiado abrumado? ¿Crees que siempre estás al límite del colapso emocional? Descubre cómo lidiar con ello y las causas de ello.", psychologist_id=6, created_at=base_time - timedelta(days=1, minutes=30)),
                Resource(resource_type_id=1, url="https://psicologiaymente.com/psicologia/errores-comunes-personas-con-ansiedad", title="Errores comunes que cometen las personas con ansiedad", description="La ansiedad puede llevar a acciones que hagan más complejos estos problemas psicoemocionales.", psychologist_id=7, created_at=datetime.now()),
                Resource(resource_type_id=1, url="https://psicologiaymente.com/psicologia/tecnica-5-pasos-superar-tristeza", title="La técnica de los 5 pasos para gestionar la tristeza", description="Una guía para comprender este estado y aprender a manejar la tristeza.", psychologist_id=8, created_at=datetime.now()),
                Resource(resource_type_id=1, url="https://www.areahumana.es/aprender-a-decir-no/", title="Aprender a decir no.", description="Saber decir no es uno de los más valiosos aprendizajes", psychologist_id=9, created_at=datetime.now()),
                Resource(resource_type_id=1, url="https://www.areahumana.es/autoengano-y-disonancia-cognitiva/", title="Autoengaño: Cuando nuestro cerebro nos miente", description="¿Por qué nos mentimos? Psicología del Autoengaño", psychologist_id=10, created_at=base_time - timedelta(days=1, minutes=30)),
            ]
            
            db.session.add_all(articles)
            db.session.commit()

            # Historial de estados de ánimo de los usuarios
            user_mood_history_entries = [
                # Entries for User 1
                UserMoodHistory(user_id=users[0].id, date=date.today() - timedelta(days=4), mood_id=moods[0].id),
                UserMoodHistory(user_id=users[0].id, date=date.today() - timedelta(days=3), mood_id=moods[1].id),
                UserMoodHistory(user_id=users[0].id, date=date.today() - timedelta(days=2), mood_id=moods[2].id),
                UserMoodHistory(user_id=users[0].id, date=date.today() - timedelta(days=1), mood_id=moods[3].id),  # Severo

                # Entries for User 2
                UserMoodHistory(user_id=users[1].id, date=date.today() - timedelta(days=3), mood_id=moods[1].id),
                UserMoodHistory(user_id=users[1].id, date=date.today() - timedelta(days=2), mood_id=moods[2].id),
                UserMoodHistory(user_id=users[1].id, date=date.today() - timedelta(days=1), mood_id=moods[3].id),  # Severo
                UserMoodHistory(user_id=users[1].id, date=date.today(), mood_id=moods[3].id),  # Severo

                # Entries for User 3
                UserMoodHistory(user_id=users[2].id, date=date.today() - timedelta(days=1), mood_id=moods[0].id),
                UserMoodHistory(user_id=users[2].id, date=date.today(), mood_id=moods[3].id),  # Severo

                # Entries for User 4
                UserMoodHistory(user_id=users[3].id, date=date.today() - timedelta(days=4), mood_id=moods[4].id),  # Extremo
                UserMoodHistory(user_id=users[3].id, date=date.today() - timedelta(days=3), mood_id=moods[4].id),  # Extremo
                UserMoodHistory(user_id=users[3].id, date=date.today() - timedelta(days=2), mood_id=moods[4].id),  # Extremo
                UserMoodHistory(user_id=users[3].id, date=date.today() - timedelta(days=1), mood_id=moods[4].id)   # Extremo
            ]

            db.session.add_all(user_mood_history_entries)
            db.session.commit()


            # Chats entre usuarios
            chats = [
                Chat(user_sender_id=users[0].id, user_reciver_id=users[1].id, message_text="¡Hola! ¿Cómo te sientes hoy?", time=datetime.now() - timedelta(hours=1)),
                Chat(user_sender_id=users[1].id, user_reciver_id=users[0].id, message_text="Hola, me siento bastante bien, ¿y tú?", time=datetime.now() - timedelta(minutes=50)),
                Chat(user_sender_id=users[0].id, user_reciver_id=users[1].id, message_text="También estoy bien, gracias por preguntar.", time=datetime.now() - timedelta(minutes=30)),
            ]
            db.session.add_all(chats)
            db.session.commit()
            
            all_psychologists = Psychologist.query.all()
            all_users = User.query.all()
            
            # Asegurarse de que hay suficientes psicólogos para asignar como se desea
            # if len(all_psychologists) < len(all_users) + 1:  # +1 porque uno recibe dos psicólogos
            #     print("No hay suficientes psicólogos para asignar según los requerimientos.")
            #     return
                    
            used_psychologists_indices = []
            
            if len(all_users) >= 3:
                chosen_indices = random.sample(range(len(all_psychologists)), 2)
                used_psychologists_indices.extend(chosen_indices)
                for index in chosen_indices:
                    new_session = Sessions(psychologist_id=all_psychologists[index].id, user_id=all_users[2].id)
                    db.session.add(new_session)
                    print(f'Assigned {all_psychologists[index].name} to {all_users[2].name}')
            
            for i, user in enumerate(all_users):
                if i != 2:  # Evitar el tercer usuario
                    available_indices = [idx for idx in range(len(all_psychologists)) if idx not in used_psychologists_indices]
                    if not available_indices:
                        print("No hay más psicólogos disponibles para asignar.")
                        break
                    chosen_index = random.choice(available_indices)
                    used_psychologists_indices.append(chosen_index)
                    new_session = Sessions(psychologist_id=all_psychologists[chosen_index].id, user_id=user.id)
                    db.session.add(new_session)
                    print(f'Assigned {all_psychologists[chosen_index].name} to {user.name}')

            db.session.commit()
            
            print("La base de datos ha sido poblada con datos de ejemplo.")
        
        except Exception as e:
            db.session.rollback() 
            print(f"Error al llenar la base de datos: {e}")
