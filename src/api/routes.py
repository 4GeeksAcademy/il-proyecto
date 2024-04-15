"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

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
        print(type(email))
        access_token = create_access_token(identity=email)
        print("Token: ", access_token)
    except Exception as e:
        return jsonify({"msg": "Error al crear el token de acceso", "error": str(e)}), 500

    access_token = create_access_token(identity=email)
    print("Token: ", access_token)  
    return jsonify(access_token=access_token)

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
