"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Location
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

    































































































































@api.route('/location/', methods=['GET'])
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
    


@api.route('/location', methods=['POST'])
def save_user_location():
    data = request.get_json()
    if 'latitude' in data and 'longitude' in data:
        latitude = data['latitude']
        longitude = data['longitude']

        # Crear una nueva instancia de Location con los datos recibidos
        new_location = Location(latitude=latitude, longitude=longitude)

        # Agregar la nueva ubicación a la sesión de la base de datos y confirmar los cambios
        db.session.add(new_location)
        db.session.commit()

        return {'message': 'Ubicación del usuario guardada correctamente.'}, 200
    else:
        return {'error': 'Datos de ubicación incompletos.'}, 400