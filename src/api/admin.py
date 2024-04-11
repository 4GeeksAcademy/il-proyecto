  
import os
from flask_admin import Admin
from .models import db, User, Location, Hobbie, Mood, UserMoodHistory, CategoryMood, Action, ResourceType, Resource, Chat, Phycologyst, Sessions
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Location, db.session))
    admin.add_view(ModelView(Hobbie, db.session))
    admin.add_view(ModelView(CategoryMood, db.session))
    admin.add_view(ModelView(Mood, db.session))
    admin.add_view(ModelView(UserMoodHistory , db.session))
    admin.add_view(ModelView(Action , db.session))
    admin.add_view(ModelView(ResourceType , db.session))
    admin.add_view(ModelView(Resource , db.session))
    admin.add_view(ModelView(Chat , db.session))
    admin.add_view(ModelView(Phycologyst , db.session))
    admin.add_view(ModelView(Sessions , db.session))
    
    
    # admin.add_view(FavoritesView(Favorites, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))