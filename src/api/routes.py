"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, current_app, render_template
from api.models import db, User
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


api = Blueprint('api', __name__)

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
    print("Received request: ", request.json)  
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    print("Email: ", email)  
    print("Password: ", password) 

    query_result = User.query.filter_by(email=email).first()
    print("Query Result: ", query_result)  

    if query_result is None:
        print("No user found") 
        return jsonify({"msg": "Bad request"}), 401

    if email != query_result.email or password != query_result.password:
        print("Invalid credentials")  
        return jsonify({"msg": "Bad request"}), 401
    
    try:
        query_result.is_active = True
        db.session.commit()
        access_token = create_access_token(identity=email)
        print("Token: ", access_token)
        user_data = query_result.serialize() 
        return jsonify(access_token=access_token, user=user_data)
    except Exception as e:
        return jsonify({"msg": "Error al crear el token de acceso", "error": str(e)}), 500


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
    if current_user:
        current_user.is_active = False
        db.session.commit()
    return jsonify({"message": "Logout successful"}), 200

## Sign Up User
@api.route("/signup", methods=["POST"])
def signup():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    name= request.json.get("name", None)
    surnames = request.json.get("surnames", None)
    is_active= False

    query_result = User.query.filter_by(email=email).first()
   
    if query_result is None:

        new_user = User(email=email, password=password, name=name, surnames=surnames, is_active=is_active)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"msg": "New user created"}), 200
    
    else :
        return jsonify({"msg": "User exist, try recover your password"}), 200
    
    

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
    