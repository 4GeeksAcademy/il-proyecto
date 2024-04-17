from flask_sqlalchemy import SQLAlchemy
from flask import current_app #<---HERE
from itsdangerous import URLSafeTimedSerializer as Serializer
# from itsdangerous import BadSignature, SignatureExpired

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    surnames = db.Column(db.String(255))
    age = db.Column(db.Integer)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    is_active = db.Column(db.Boolean)
    profile_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime)
    location_id = db.Column(db.Integer, db.ForeignKey('location.id'))
    hobbie_id = db.Column(db.Integer, db.ForeignKey('hobbie.id'))
    mood_id = db.Column(db.Integer, db.ForeignKey('mood.id'))
    phycologyst_id = db.Column(db.Integer, db.ForeignKey('phycologyst.id'))

    def get_reset_token(self, expires_sec=84600):
        serializer = Serializer(secret_key=current_app.config['SECRET_KEY'], salt=current_app.config['SECURITY_PASSWORD_SALT'])
        return serializer.dumps({'user_id': self.id})
    
    # @staticmethod
    # def verify_reset_token(token):
    #     s = Serializer(current_app.config['SECRET_KEY'])
    #     try:
    #         user_id = s.loads(token, max_age=84600)['user_id']
    #         print(user_id)
    #     except:
    #         return None
    #     return User.query.get(user_id)
    @staticmethod
    def verify_reset_token(token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token, salt=current_app.config['SECURITY_PASSWORD_SALT'], max_age=84600)
            user_id = data.get('user_id')
            if user_id:
                user = User.query.get(user_id)
                return user
        except:
            pass
        return None

    
    def __repr__(self):
        return '<Users %r>' % self.id
     

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "surnames": self.surnames,
            "age": self.age,
            "is_active": self.is_active,
            "profile_url": self.profile_url
            # Do not serialize the password, it's a security breach
        }

class Location(db.Model):
    __tablename__ = 'location'
    id = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    users = db.relationship('User', backref='location', lazy=True)
    
    def __repr__(self):
        return '<Location %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "latitude": self.latitude,
            "longitude": self.longitude,
        }
        
class Hobbie(db.Model):
    __tablename__ = 'hobbie'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    users = db.relationship('User', backref='hobbie', lazy=True)

    def __repr__(self):
        return '<Hobbie %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }

class CategoryMood(db.Model):
    __tablename__ = 'category_mood'
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(255))
    moods = db.relationship('Mood', backref='category_mood', lazy=True, uselist=False)
    
    def __repr__(self):
         return '<CategoryMood %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "category": self.category,
        }

class Mood(db.Model):
    __tablename__ = 'mood'
    id = db.Column(db.Integer, primary_key=True)
    mood = db.Column(db.String(255))
    category_id = db.Column(db.Integer, db.ForeignKey('category_mood.id'), unique=True)
    description = db.Column(db.String(255))
    users = db.relationship('User', backref='mood', lazy=True)
    
    def __repr__(self):
        return '<Mood %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "mood": self.mood,
            "description": self.description,
        }

class UserMoodHistory(db.Model):
    __tablename__ = 'user_mood_history'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    date = db.Column(db.Date, primary_key=True)
    mood_id = db.Column(db.Integer, db.ForeignKey('mood.id'))
    user = db.relationship('User', backref='user_mood_history')
    mood = db.relationship('Mood')
    
    def __repr__(self):
        return '<UserMoodHistory %r>' % self.id

    def serialize(self):
        return {
            "user_id": self.user_id,
            "date": self.date,
            "mood_id": self.mood_id,
        }

class Action(db.Model):
    __tablename__ = 'actions'
    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(255))
    description = db.Column(db.String(255))
    category_id = db.Column(db.Integer, db.ForeignKey('category_mood.id'))

    category = db.relationship('CategoryMood', backref='actions')

    def __repr__(self):
        return '<Action %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "action": self.action,
            "description": self.description,
            "category_id": self.category_id,
        }

class ResourceType(db.Model):
    __tablename__ = 'resource_type'
    id = db.Column(db.Integer, primary_key=True)
    resource_type = db.Column(db.String(255))
    
    def __repr__(self):
        return '<ResourceType %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "resource_type": self.resource_type,
        }

class Resource(db.Model):
    __tablename__ = 'resource'
    id = db.Column(db.Integer, primary_key=True)
    resource_type_id = db.Column(db.Integer, db.ForeignKey('resource_type.id'))
    url = db.Column(db.String(255))
    description = db.Column(db.String(255))
    phycologyst_id = db.Column(db.Integer, db.ForeignKey('phycologyst.id'))
    resource_type = db.relationship('ResourceType', backref='resource')
    phycologyst = db.relationship('Phycologyst', backref='resource')
    
    def __repr__(self):
        return '<Resource %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "resource_type_id": self.resource_type_id,
            "url": self.url,
            "description": self.description,
        }

class Chat(db.Model):
    __tablename__ = 'chat'
    id = db.Column(db.Integer, primary_key=True)
    user_sender_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_reciver_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    message_text = db.Column(db.String(255))
    time = db.Column(db.DateTime)
    sender = db.relationship('User', foreign_keys=[user_sender_id])
    receiver = db.relationship('User', foreign_keys=[user_reciver_id])
    
    def __repr__(self):
        return '<Chat %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "user_sender_id": self.user_sender_id,
            "user_reciver_id": self.user_reciver_id,
            "message_text": self.message_text,
            "time": self.time,
        }

class Phycologyst(db.Model):
    __tablename__ = 'phycologyst'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    surnames = db.Column(db.String(255))
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    experience = db.Column(db.Integer)
    users = db.relationship('User', backref='phycologyst', lazy=True)
    
    def __repr__(self):
        return '<Phycologyst %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "surnames": self.surnames,
            "email": self.email,
            "experience": self.experience,
        }

class Sessions(db.Model):
    __tablename__ = 'sessions'
    id = db.Column(db.Integer, primary_key=True)
    phycologyst_id = db.Column(db.Integer, db.ForeignKey('phycologyst.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    phycologyst = db.relationship('Phycologyst', backref='sessions')
    user = db.relationship('User', backref='sessions')
    
    def __repr__(self):
        return '<Sessions %r>' % self.id
        

    def serialize(self):
        return {
            "id": self.id,
            "phycologyst_id": self.phycologyst_id,
            "user_id": self.user_id,
        }

