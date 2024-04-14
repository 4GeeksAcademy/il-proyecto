"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, Location
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


@app.route('/location', methods=['POST'])
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
    

@app.route('/location', methods=['GET'])
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

    


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
