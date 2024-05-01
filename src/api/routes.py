"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import random, math, os
import re
from random import uniform
from flask import Flask, request, jsonify, url_for, Blueprint, current_app, render_template
from api.models import db, User, Location, Mood, Resource, ResourceType, CategoryMood, UserMoodHistory, Psychologist, Chat
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from collections import defaultdict
from sqlalchemy import func
# google
from google.oauth2 import id_token
from google.auth.transport import requests
import os

# mail 
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature
from flask_mail import Message
from datetime import datetime

#hash password
import bcrypt


from flask_session import Session
from flask import session

#socket.io
from flask_socketio import emit, join_room, leave_room
from flask import request

api = Blueprint('api', __name__)

app = Flask(__name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route("/login", methods=['POST'])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email).first()

    if user: 
        stored_password_hash = user.password  
        if bcrypt.checkpw(password.encode('utf-8'), stored_password_hash.encode('utf-8')):
            try:
                user.is_active = True  
                db.session.commit()
                access_token = create_access_token(identity=email)
                user_data = user.serialize()  # Cambié query_result a user
                return jsonify(access_token=access_token, user=user_data)
            except Exception as e:
                return jsonify({"msg": "Error al crear el token de acceso", "error": str(e)}), 500
        else: 
            print("Invalid credentials")  
            return jsonify({"msg": "Credenciales inválidas"}), 401
    else:
        print("No user found") 
        return jsonify({"msg": "Usuario no encontrado"}), 401
    
    
# Protect a route with jwt_required, which will kick out requests
# # without a valid JWT present.
@api.route('/valid-token', methods=['GET'])
@jwt_required()
def validate_token():
    current_user_email = get_jwt_identity()
    
    current_user_data = User.query.filter_by(email=current_user_email).first()

    if  current_user_data == None:
        return jsonify({"msg": "User doesn't exists", "is_logged": False}), 404 
    return jsonify({"is_logged": True }), 200


@api.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    current_user_email = get_jwt_identity()
    current_user = User.query.filter_by(email=current_user_email).first()
    print(current_user)
    if current_user:
        current_user.is_active = False
        db.session.commit()
    return jsonify({"message": "Logout successful"}), 200


## Sign Up User
@api.route("/signup", methods=["POST"])
def signup():
    email = request.json.get("email", None)
    
    password = request.json.get("password", None)
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    name= request.json.get("name", None)
    surnames = request.json.get("surnames", None)
    is_active= False
    created_at = datetime.now()
    profile_url = re.sub(r'[^a-z0-9]', '', name.replace(" ", "").lower()) + re.sub(r'[^a-z0-9]', '', surnames.replace(" ", "").lower())

    



    query_result = User.query.filter_by(email=email).first()
    if query_result is None:
        new_user = User(email=email, password=hashed_password, name=name, surnames=surnames, is_active=is_active, created_at=created_at, profile_url=profile_url)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"msg": "New user created"}), 200
    
    else :
        return jsonify({"msg": "Ya existe un usuario con este mail, recupera tu contraseña."}), 401
    
    
@api.route('/login-google', methods=['POST'])
def login_google():
    token = request.json.get('id_token')
    google_client_id = os.getenv('GOOGLE_CLIENT_ID') 
    
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), google_client_id)

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        # Obtener los datos del usuario
        email = idinfo['email']
        name = idinfo.get('name', "")

        # Verificar si el usuario ya existe en la base de datos
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(email=email, name=name, is_active=True)
            db.session.add(user)
            db.session.commit()
        else:
            user.is_active = True
            db.session.commit()

        # Crear token de JWT
        access_token = create_access_token(identity=email)
        user_data = user.serialize()
        return jsonify(access_token=access_token, user=user_data)

    except ValueError:
        # Invalid token
        return jsonify({"msg": "Token de Google inválido"}), 401



def get_external_base_url():
    default_host = os.getenv('FRONT_URL')
    return os.getenv('EXTERNAL_HOST_URL', default_host)

@api.route('/reset-password', methods=['POST'])
def reset_password_request():
    email = request.json['email']
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'No existe ninguna cuenta con ese email'}), 404

    token = user.get_reset_token()
    send_reset_email(user, token)

    return jsonify({'message': 'Por favor revisa tu email para las instrucciones de reseteo de contraseña'}), 200


def send_reset_email(user, token):
    from app import mail
    base_host = get_external_base_url()  
    scheme = 'https'
    
    link = url_for('api.reset_password_request', token=token, _external=False)
    new_link = link.replace("/api", "")
    full_link = f"{base_host}{new_link}"  
    print("*************************************************")
    print(full_link)
    print("*************************************************")
    # msg = Message('Recuperar contraseña',
    #               sender='mymoodbnp@gmail.com',
    #               recipients=[user.email])
    # msg.body = f'''Por favor sigue el enlace para poder recuperar tu contraseña: 
    # {full_link} 
    # Si no realizó esta solicitud, simplemente ignore este correo electrónico y no se realizarán cambios.'''

    msg = Message('Recuperar contraseña',
                  sender='mymoodbnp@gmail.com',
                  recipients=[user.email])
    msg.html = render_template('email_template.html', full_link=full_link)
        
    mail.send(msg)


@api.route('/reset-password/<token>', methods=["GET", "POST"])
def reset_token(token):
    user = User.verify_reset_token(token)
    if not user:
        return jsonify({'message': 'El token no es válido o ha expirado'}), 400
    if request.method == 'POST':
        password = request.json['password']
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user.password = hashed_password 
        db.session.commit()
        return jsonify({'message': '¡Contraseña actualizada!'}), 200
    return jsonify({'message': 'Invalid method'}), 405


@api.route('/delete-account/<int:user_id>', methods=['DELETE'])
def delete_account(user_id):
    try:
        user_data = User.query.filter_by(id=user_id).first()
        if user_data:
            db.session.delete(user_data)
            db.session.commit()
            return jsonify({'message': 'La cuenta se eliminó correctamente'}), 200
        else:
            return jsonify({'error': 'Usuario no encontrado'}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al eliminar la cuenta', 'details': str(e)}), 500



# trae todas las localizaciones de la base de datos( para pruebas )    
@api.route('/location', methods=['GET'])
@jwt_required()
def get_all_location():
    current_user = get_jwt_identity()
    # print(current_user)
    if current_user:
        query_results = Location.query.all()
        results = list(map(lambda item: item.serialize(), query_results))

    
        print(query_results)
        
        if results != []:
            response_body = {
            "msg": "OK",
            "results": results
        }
            return jsonify(response_body), 200
        
        else:
            return jsonify({"msg": "There aren't any location yet"}), 404
    

# trae todas las localizaciones de los usuarios activos
@api.route('/users/active-locations', methods=['GET'])
@jwt_required()
def get_active_users_locations():
    # Obtén todos los usuarios activos
    active_users = User.query.filter_by(is_active=True).all()

    # Obtén la ubicación de cada usuario activo
    user_locations = []
    for user in active_users:
        user_data = user.serialize()  # Asume que tienes un método serialize en tu modelo User
        if user.location_id:
            location = Location.query.filter_by(id=user.location_id).first()
            if location:
                user_data['location'] = location.serialize()
            else:
                return jsonify({"msg": f"No location found for user {user.id}"}), 404
        user_locations.append(user_data)

    # Si se encontraron usuarios, devuelve un objeto JSON con los usuarios y sus ubicaciones
    if user_locations:
        return jsonify(user_locations), 200
    else:
        return jsonify({"msg": "No active users found"}), 404
    


# Guardar la ubicación de un usuario activo con un ruido aleatorio
@api.route("/user/location", methods=["POST"])
@jwt_required()
def save_user_location():
    # Obtener datos de la solicitud
    user_id = request.json.get("user_id")
    latitude = request.json.get("latitude")
    longitude = request.json.get("longitude")

    # Validar datos recibidos
    if user_id is None or latitude is None or longitude is None:
        return jsonify({"error": "Invalid request data"}), 400

    # Ofuscar la ubicación agregando un pequeño ruido aleatorio
    latitude += uniform(-0.018, 0.018)
    longitude += uniform(-0.018, 0.018)

    # Buscar al usuario por su ID
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({"error": "User not found", "user": user_id}), 404

# Si el usuario ya tiene una ubicación activa, actualizarla
    if user.location:
        user.location.latitude = latitude
        user.location.longitude = longitude
    else:
        # Si el usuario no tiene una ubicación, crear una nueva
        location = Location(latitude=latitude, longitude=longitude)
        db.session.add(location)
        user.location = location

    db.session.commit()  # Guardar los cambios en la base de datos

    return jsonify({"msg": "Location assigned to user successfully", "user": user_id}), 200
        

# trae todas los resources de la base de datos 
@api.route('/resources', methods=['GET'])
# @jwt_required()
def get_all_resources():
    resource_results = Resource.query.all()
    results = list(map(lambda item: item.serialize(), resource_results))
  
    if results != []:
        response_body = {
        "msg": "OK",
        "results": results
        }    
        return jsonify(response_body), 200
  
    else:
        return jsonify({"msg": "There aren't any location yet"}), 404
    
@api.route('/resources-bytype', methods=['GET'])
def get_resources_by_type():
    resource_results = Resource.query.all()

    resources_by_type = defaultdict(list)

    for resource in resource_results:
        # Acceder al tipo del recurso a través de su relación 'resource_type'
        resource_type = resource.resource_type.resource_type if resource.resource_type else None
        if resource_type:
            resources_by_type[resource_type].append(resource.serialize())

    # Convertir el diccionario a una lista de diccionarios para que pueda ser serializado a JSON
    type_resources = [{"type": type, "resources": resources} for type, resources in resources_by_type.items()]

    if type_resources:
        response_body = {
            "msg": "OK",
            "results": type_resources,
            "number_of_resources": sum(len(resources) for resources in resources_by_type.values())
        }
        return jsonify(response_body), 200
    else:
        return jsonify({"msg": "There aren't any resources yet"}), 404
    


#-------------------------------------------------------------------#
# PSYCHOLOGIST
#-------------------------------------------------------------------#

@api.route('/psychologist', methods=['GET'])
@jwt_required()
def getAllPsychologistData():
    psychologistList = Psychologist.query.all()

    results = [psychologist.serialize() for psychologist in psychologistList]
    
    if psychologistList:
        response_body = {
            "msg": "OK",
            "results": results
        }
        return jsonify(response_body), 200
    else:
        return jsonify({"msg": "Any psychologist found"}), 404

@api.route('/psychologist/<int:ps_id>', methods=['GET'])
@jwt_required()
def getPsychologistData(ps_id):
    psychologistData = Psychologist.query.filter_by(id=ps_id).first()

    if psychologistData:
        response_body = {
            "msg": "OK",
            "results": psychologistData.serialize()
        }
        return jsonify(response_body), 200
    else:
        return jsonify({"msg": "No psychologist found"}), 404

    
@api.route('/ps-resources/<int:psychologist_id>', methods=['GET'])  # Use underscore in the URL parameter
@jwt_required()
def get_psychologist_resources(psychologist_id):  # Match the parameter name with the route
    resource_results = Resource.query.filter_by(psychologist_id=psychologist_id).all()  # Use correct field name and call all()
    results = list(map(lambda item: item.serialize(), resource_results))
  
    if results:
        response_body = {
            "msg": "OK",
            "results": results
        }    
        return jsonify(response_body), 200
    else:
        return jsonify({"msg": "There aren't any resources yet"}), 404


@api.route('/moods', methods=['GET'])
@jwt_required()
def get_all_moods():
    categories = CategoryMood.query.all()  # Obtener todas las categorías
    results = []
    for category in categories:
            # Obtén un mood aleatorio de cada categoría
            mood = Mood.query.filter_by(category_id=category.id).order_by(func.random()).first()
            if mood:
                mood_dict = mood.serialize()
                mood_dict["icon_url"] = category.icon_url  
                mood_dict["category_name"] = category.category  
                results.append(mood_dict)  

    if results:
        return jsonify({"msg": "OK", "results": results}), 200
    else:
        return jsonify({"msg": "No moods available"}), 404


#ultima categoria de estado de animo del usuario
@api.route("/user/<int:user_id>/last_mood_category", methods=["GET"])
# @jwt_required()
def get_last_mood_category(user_id):
    # Buscar el último registro de UserMoodHistory para el usuario
    last_mood_history = UserMoodHistory.query.filter_by(user_id=user_id).order_by(UserMoodHistory.date.desc()).first()
    if not last_mood_history or not last_mood_history.mood or not last_mood_history.mood.category_mood:
        return jsonify({"error": "No mood history or category found for user", "user": user_id}), 404

    # Obtener la categoría del estado de ánimo
    mood_category = last_mood_history.mood.category_mood.category

    return jsonify({"last_mood_category": mood_category, "user": user_id}), 200



# todos los usuarios
@api.route('/users', methods=['GET'])
def get_all_users():
    user_results = User.query.all()
    results = []

    for user in user_results:
        user_dict = user.serialize()
        results.append(user_dict)

    if results:
        response_body = {
            "msg": "OK",
            "results": results
        }
        return jsonify(response_body), 200

    else:
        return jsonify({"msg": "There aren't any users yet"}), 404
    


# todos los usuarios activos
@api.route('/users-active', methods=['GET'])
def get_all_users_active():
    user_results = User.query.filter_by(is_active=True).all()
    results = []

    for user in user_results:
        user_dict = user.serialize()
        results.append(user_dict)

    if results:
        response_body = {
            "msg": "OK",
            "results": results
        }
        return jsonify(response_body), 200

    else:
        return jsonify({"msg": "There aren't any active users yet"}), 404
    




@api.route('/user/<int:user_id>/mood', methods=['PUT'])
@jwt_required()
def update_user_mood(user_id):
    # Busca el usuario por su ID
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Obtiene el ID del estado de ánimo de la solicitud
    mood_id = request.json.get('mood_id')
    if not mood_id:
        return jsonify({"error": "Mood ID is required"}), 400

    # Busca el estado de ánimo por su ID
    mood = Mood.query.get(mood_id)
    if not mood:
        return jsonify({"error": "Mood not found"}), 404

    # Actualiza la categoría de estado de ánimo del usuario con la del nuevo estado de ánimo
    user.mood_id = mood.id
    db.session.commit()

    # Serializa el usuario y devuelve la respuesta
    return jsonify({"user": user.serialize()}), 200


@api.route('/current-user', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.filter_by(email=user_id).first()
    if user:
        return jsonify(user.serialize()), 200
    else:
        return jsonify({"msg": "User not found"}), 404
    


# CHAT


@api.route('/user/<int:user_id>', methods=['GET'])
def get_one_user(user_id):
    query_results = User.query.filter_by(id=user_id).first()
 
    print(query_results)
    
    if query_results is not None:
        response_body = {
        "msg": "OK",
        "results": query_results.serialize()
    }
        return jsonify(response_body), 200
    
    else:
        return jsonify({"msg": f"User {user_id} not found"}), 404
    

#Socket.io
def register_socket_events(socket_io):

    @socket_io.on('data')
    def handle_message(data):
        """event listener when client sends data"""
        print("Data from the front end: ", str(data))
        emit("data", {'data': data, 'id': request.sid}, broadcast=True)

    @socket_io.on('connect')
    def test_connect():
        """event listener when client connects to the server"""
        print("Client connected")
        emit('your_id', {'id': request.sid}, room=request.sid)

    @socket_io.on('disconnect')
    def test_disconnect():
        """event listener when client disconnects from the server"""
        print("Client disconnected")

    @socket_io.on('message')
    def test_message(data):
        print(str(data))

    # @socket_io.on('connect')
    # def test_connect():
    #     # user_id = int(data['user_id'])  # Convertir a entero
    #     # room = data["room"]
    #     """event listener when client connects to the server"""
    #     print("11111111111111111111111111111111111111111111111111111111111111111")
    #     print(request)
    #     print("Client connected")
    #     emit('connected', {'message': 'Your are connected'})
   


    # @socket_io.on('disconnect')
    # def test_disconnect():
    #     """event listener when client disconnects from the server"""
    #     print("Client disconnected")

    # @socket_io.on('message')
    # def test_message(data):
    #     print(str(data))

    # @socket_io.on('data')
    # def handle_message(data):
    #     """event listener when client sends data"""
    #     print("Data from the front end: ", str(data))
    #     emit("data", {'message': data.message, 'sender_id': data.sender_id, 'timestamp': data.timestamp, 'room': data.room}, broadcast=True)


    @socket_io.on('join')
    def on_join(data):
        print("BACK JOIN")
        print(data["room"])
        print(data)
        user_id = int(data['user_id'])  # Convertir a entero
        other_user_id = int(data['other_user_id'])  # Convertir a entero
        room = data["room"]
        join_room(room)
        emit('joined_room', {'room': room, 'user_id': user_id, 'other_user_id': other_user_id}, room=room)

    # @socket_io.on('leave')
    # def on_leave(data):
    #     room = data['room']
    #     leave_room(room)
    #     emit('left_room', {'room': room}, room=room)


    # @socket_io.on('data')
    # def handle_message_chat(data):
    #     print("BACK MESSAGE SENDIINGGGG")
    #     room = data['room']
    #     message = data['message']
    #     sender_id = data['sender_id']
    #     # Emitir el mensaje a todos en la sala, excepto al remitente
    #     emit('data', {'message': message, 'sender_id': sender_id, 'room': room}, room=room)
    #     print("BACK MESSAGE SENDIINGGGG 222222")
    #     print("BACK MESSAGE SENDIINGGGG 333333")     
    #     print("Data from the front end: ", str(data))


@api.route('/send_chat_message', methods=['POST'])
def send_message():
    data = request.json.get('data')
    id = request.json.get('id')
    print("Received data:", data)  # Log para ver qué datos llegan exactamente
    # Continúa procesando los datos si son correctos
    new_message = Chat(
        user_sender_id="3",
        user_reciver_id="4",
        message_text=data['message'],
        time=data['timestamp']
        # datetime.fromisoformat(data['timestamp'])  # Convertir el timestamp ISO 8601 a datetime
    )
    db.session.add(new_message)
    db.session.commit()
    return jsonify({'message': 'Message sent successfully'}), 200
        

    



