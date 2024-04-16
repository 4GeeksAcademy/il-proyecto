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
@api.route('/validate-token/', methods=['GET'])
@jwt_required()
def validate_token():
    current_user = get_jwt_identity()
    current_user_data = User.query.filter_by(email=current_user.email).first()

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


@api.route("/send_mail", methods=['GET'])
def send_mail():
    from app import mail
    msg = Message("Hola desde Flask-Mail",
                  sender="mymoodnbp@gmail.com",
                  recipients=["natalia@funtsak.com"])
    msg.body = "Este es el cuerpo del mensaje de correo electrónico."
    mail.send(msg)
    return "Mensaje enviado con éxito!"

# @api.route('/send-mail/<email>')
# def send_mail(email):
#     email = 'natalia@funtsak.com'
#     from app import mail
#     msg = Message("Reset Your Password", sender="mymoodnbp@gmail.com", recipients=[email])
#     # Usar render_template para generar el HTML del correo
#     msg.html = render_template('email_template.html', name="John Doe", link="https://example.com/reset-password")
#     print(msg.html)
#     mail.send(msg)
#     return "Email sent successfully!"

def get_external_base_url():
    # Puedes definir estas variables en tu configuración o archivo .env
    default_host = 'verbose-capybara-pqj4vpg6jg2rj9q-3001.app.github.dev'
    scheme = 'https'  # Cambiar a 'http' si es necesario
    host = os.getenv('EXTERNAL_HOST_URL', default_host)
    return f"{scheme}://{host}"

@api.route('/reset-password', methods=['POST'])
def reset_password_request():
    from app import mail
    email = request.json['email']
    serializer = URLSafeTimedSerializer(current_app.config['JWT_SECRET_KEY'])

    token = serializer.dumps(email, salt=current_app.config['SECURITY_PASSWORD_SALT'])
    base_url = get_external_base_url()  # Obtiene la URL base externa
    link = url_for('api.reset_password', token=token, _external=False)
    full_link = f"{base_url}{link}"  # Construye la URL completa

    msg = Message("Reset your MyMood Password",
                  sender="mymoodbnp@gmail.com",
                  recipients=[email])
    
    msg.body = f"Please click on the link to reset your password: {full_link}"
    mail.send(msg)

    return jsonify({'message': 'Please check your email for the password reset link.'}), 200


@api.route('/reset-password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    try:
        serializer = URLSafeTimedSerializer(current_app.config['JWT_SECRET_KEY'])
        email = serializer.loads(
            token,
            salt=current_app.config['SECURITY_PASSWORD_SALT'],
            max_age=3600  # Token expires after 1 hour
        )
    except SignatureExpired:
        return jsonify({"message": "The password reset link is expired."}), 400
    except BadTimeSignature:
        return jsonify({"message": "Invalid token. Please request a new password reset."}), 400

    # Reset password logic here
    return jsonify({"message": "Password has been reset successfully."}), 200
