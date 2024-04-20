"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, current_app, render_template
from api.models import db, User, Location, Mood
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

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
        user.password = password 
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






@api.route('/user', methods=['GET'])
def get_all_users():
    query_results = User.query.filter(User.is_active == True).all()
    results = list(map(lambda item: item.serialize(), query_results))
    return jsonify(results), 200
 
 

    
@api.route('/location', methods=['GET'])
# @jwt_required()
def get_all_location():
    # current_user = get_jwt_identity()
    # print(current_user)
    # if current_user:
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
    


@api.route("/location", methods=["POST"])
def save_user_location():
    latitude = request.json.get("latitude", None)
    longitude = request.json.get("longitude", None)
    
    query_result = Location.query.filter_by(latitude=latitude, longitude=longitude).first()
     
    if query_result is None:

        new_location = Location(latitude=latitude, longitude=longitude)
        db.session.add(new_location)
        db.session.commit()

        return jsonify({"msg": "New location created"}), 200
    
    else :
        return jsonify({"msg": "Location exist, try another location"}), 200



@api.route("/location-user", methods=["POST"])
def location_user():
    user_id  = request.json.get("user_id", None)
    latitude = request.json.get("latitude", None)
    longitude = request.json.get("longitude", None)

    location_result = Location.query.filter_by(latitude=latitude, longitude=longitude).first()

    user_result = User.query.filter_by(id=user_id).first()
     
    if user_result:
        user_result.location_id = location_result.id             
        db.session.commit()

        return jsonify({"msg": "User location saved", "user": user_id}), 200
    
    else :
        return jsonify({"msg": "User doesn't exist", "user": user_id}), 200
    


@api.route('/users/active_locations', methods=['GET'])
def active_user_locations():
    active_users = User.query.filter_by(is_active=True).all()

    active_locations = []

    for user in active_users:
        if user.location_id:
            location = Location.query.get(user.location_id)
            if location:
                active_locations.append({
                    'latitude': location.latitude,
                    'longitude': location.longitude
                })
      
    return jsonify({'active_locations': active_locations})




# @api.route('/location/<int:location_id>', methods=['DELETE'])
# def delete_location(location_id):
#     try:
#         # Verificar si la ubicación con el ID proporcionado existe en la base de datos
#         location = Location.query.get(location_id)
        
#         if not location:
#             return jsonify({'error': 'Ubicación no encontrada'}), 404
        
#         # Eliminar la ubicación de la base de datos
#         db.session.delete(location)
#         db.session.commit()

#         return jsonify({'message': 'Ubicación eliminada correctamente'}), 200
    
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
    