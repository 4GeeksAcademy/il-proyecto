import click
from .models import db, User, Location, Hobbie, Mood, UserMoodHistory, CategoryMood, Action, ResourceType, Resource, Chat, Phycologyst, Sessions
from datetime import datetime, date, timedelta
import bcrypt

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
    

    @app.cli.command("fill-db-with-example-data")
    def fill_db_with_example_data():
        """ Este comando rellenará la base de datos con datos de ejemplo. """
          

        db.drop_all()
        db.create_all()

        try:
            
            locations = [
                Location(latitude=40.4167, longitude=-3.7033), #(Puerta del Sol)
                Location(latitude=40.4150, longitude=-3.6833), #(Parque del Retiro)
                Location(latitude=40.4155, longitude=-3.7079), #(Plaza Mayor)
                Location(latitude=40.4240, longitude=-3.7174), #(Templo de Debod)
                Location(latitude=40.4170, longitude=-3.7133), #(Palacio Real de Madrid)
                Location(latitude=40.4530, longitude=-3.6883), #(Estadio Santiago Bernabéu)
                Location(latitude=40.4155, longitude=-3.7094), #(Mercado de San Miguel)
                Location(latitude=40.4075, longitude=-3.7079), #(El Rastro)
                Location(latitude=40.4139, longitude=-3.6922) #(Museo Nacional del Prado)
            ]
            db.session.add_all(locations)
            db.session.commit() 

            users = [
                User(name="Bárbara", surnames="Puyol", age="30", email="barbara@mymood.com", 
                     password=bcrypt.hashpw("111111".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), 
                     is_active=False, created_at=date.today()),
                User(name="Pedro", surnames="Berruezo", age="30", email="pedro@mymood.com", 
                     password=bcrypt.hashpw("222222".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), 
                     is_active=True, created_at=date.today(),location_id=locations[0].id),
                User(name="Natalia", surnames="L. Salas", age="40", email="nat@mymood.com", 
                     password=bcrypt.hashpw("333333".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),  
                     is_active=True, created_at=date.today(),location_id=locations[1].id),
                User(name="Natalia", surnames="L. Salas", age="40", email="natalia@funtsak.com", 
                    password=bcrypt.hashpw("444444".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),  
                     is_active=True, created_at=date.today(),location_id=locations[3].id)
            ]  
            db.session.add_all(users)
            db.session.commit() 

            categories = [
                CategoryMood(category="Feliz/Contento"),
                CategoryMood(category="Triste/Deprimido"),
                CategoryMood(category="Ansioso/Estresado"),
                CategoryMood(category="Enojado/Frustrado")
            ]
            db.session.add_all(categories)
            db.session.commit() 
            
            moods = [
                Mood(mood="Alegre", description="Me siento lleno de energía", category_id=categories[0].id),
                Mood(mood="Melancólico", description="Un poco triste hoy", category_id=categories[1].id),
                Mood(mood="Agobiado", description="Demasiadas cosas en la cabeza", category_id=categories[2].id),
                Mood(mood="Irritado", description="Todo me molesta", category_id=categories[3].id)
            ]
            db.session.add_all(moods)
            db.session.commit()  
            
            hobbies = [
                Hobbie(name="Fotografía"),
                Hobbie(name="Ciclismo"),
                Hobbie(name="Dibujo"),
                Hobbie(name="Programación")
            ]
            db.session.add_all(hobbies)
            db.session.commit()
            
            psychologists = [
                Phycologyst(name="Ana", surnames="Pérez", email="ana@mymood.com", password="secure", experience=5),
                Phycologyst(name="Carlos", surnames="Gómez", email="carlos@mymood.com", password="secure", experience=7)
            ]
            db.session.add_all(psychologists)
            db.session.commit()  
               
            resource_types = [
                ResourceType(resource_type="Artículo"),
                ResourceType(resource_type="Vídeo"),
                ResourceType(resource_type="Imagen"),
                ResourceType(resource_type="Podcast")
            ]
            db.session.add_all(resource_types)
            db.session.commit()  
            
            resources = [
                Resource(resource_type_id=resource_types[0].id, url="https://example.com/articulo1", description="Cómo manejar el estrés", phycologyst_id=psychologists[0].id),
                Resource(resource_type_id=resource_types[1].id, url="https://example.com/video1", description="Meditación para principiantes", phycologyst_id=psychologists[1].id)
            ]

            db.session.add_all(resources)
            db.session.commit()  
            
            # Acciones relacionadas con las categorías de estados de ánimo
            actions = [
                Action(action="Hablar con un amigo", description="Compartir tus sentimientos puede ayudar a ver las cosas desde otra perspectiva.", category_id=categories[0].id),  # Feliz/Contento
                Action(action="Escribir en un diario", description="Escribir tus pensamientos puede ayudarte a comprenderlos mejor.", category_id=categories[1].id),  # Triste/Deprimido
                Action(action="Meditación", description="La meditación puede ayudarte a calmar tu mente.", category_id=categories[2].id),  # Ansioso/Estresado
                Action(action="Ejercicio físico", description="El ejercicio puede ayudar a liberar la tensión acumulada.", category_id=categories[3].id)  # Enojado/Frustrado
            ]
            db.session.add_all(actions)
            db.session.commit()

            # Historial de estados de ánimo de los usuarios
            user_mood_history_entries = [
                UserMoodHistory(user_id=users[0].id, date=date.today() - timedelta(days=1), mood_id=moods[0].id),
                UserMoodHistory(user_id=users[1].id, date=date.today() - timedelta(days=2), mood_id=moods[1].id),
                UserMoodHistory(user_id=users[2].id, date=date.today() - timedelta(days=3), mood_id=moods[2].id)
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
            
            print("La base de datos ha sido poblada con datos de ejemplo.")
        
        except Exception as e:
            db.session.rollback() 
            print(f"Error al llenar la base de datos: {e}")
         
       
        

       