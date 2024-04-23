"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import random, math, os
from random import uniform
from flask import Flask, request, jsonify, url_for, Blueprint, current_app, render_template
from api.models import db, User, Location, Mood, Resource, ResourceType, CategoryMood
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from collections import defaultdict
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
    
    query_result = User.query.filter_by(email=email).first()
    if query_result is None:
        new_user = User(email=email, password=hashed_password, name=name, surnames=surnames, is_active=is_active, created_at=created_at)
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
    
    print(full_link)
     
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
    # current_user = get_jwt_identity()
    # print(current_user)
    # if current_user:
        resource_results = Resource.query.all()
        # type_results = ResourceType.query.all()
        # print(type_results)
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
    


@api.route('/moods', methods=['GET'])
# @jwt_required()
def get_all_moods():
    resource_results = Mood.query.all()
    results = {}

    for mood in resource_results:
        mood_dict = mood.serialize()
        category = CategoryMood.query.filter_by(id=mood.category_id).first()
        if category:
            mood_dict["icon_url"] = category.icon_url  # Aquí se añade el icon_url
            # Se elimina la línea que añade la categoría al mood_dict

            # Si la categoría ya está en los resultados, añade el Mood a la lista de esa categoría
            if category.category in results:
                results[category.category].append(mood_dict)
            # Si la categoría no está en los resultados, crea una nueva lista para esa categoría
            else:
                results[category.category] = [mood_dict]

    if results != {}:
        response_body = {
            "msg": "OK",
            "results": results
        }
        return jsonify(response_body), 200

    else:
        return jsonify({"msg": "There aren't any location yet"}), 404