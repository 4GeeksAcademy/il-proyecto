"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Location
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

# google
from google.oauth2 import id_token
from google.auth.transport import requests
import os

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

    query_result = User.query.filter_by(email=email).first()
   
    if query_result is None:

        new_user = User(email=email, password=password, name=name)
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



@api.route('/location', methods=['GET'])
def get_all_location():
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


























































































































