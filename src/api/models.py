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
    created_at = db.Column(db.Date)
    location_id = db.Column(db.Integer, db.ForeignKey('location.id'))
    hobbie_id = db.Column(db.Integer, db.ForeignKey('hobbie.id'))
    mood_id = db.Column(db.Integer, db.ForeignKey('mood.id'))
    phycologyst_id = db.Column(db.Integer, db.ForeignKey('phycologyst.id'))

    def get_reset_token(self, expires_sec=84600):
        serializer = Serializer(secret_key=current_app.config['SECRET_KEY'], salt=current_app.config['SECURITY_PASSWORD_SALT'])
        return serializer.dumps({'user_id': self.id})
    
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
        # Obtén la última entrada de UserMoodHistory para este usuario
        last_mood_history = UserMoodHistory.query.filter_by(user_id=self.id).order_by(UserMoodHistory.date.desc()).first()
        mood = Mood.query.filter_by(id=self.mood_id).first()
        hobbie = Hobbie.query.filter_by(id=self.hobbie_id).first()
        psychologists = [session.phycologyst.serialize() for session in self.sessions]


        print(hobbie)              
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "surnames": self.surnames,
            "age": self.age,
            "is_active": self.is_active,
            "profile_url": self.profile_url,
            "location": self.location.serialize() if self.location else None,
            "user_mood": self.mood.serialize() if self.mood else None,
            "hobbie": self.hobbie.name if self.hobbie else None,
            'created_at': self.created_at.strftime('%Y-%m-%d') if self.created_at else None,
            "psychologists": psychologists
           
            # Do not serialize the password, it's a security breach
        }

class Location(db.Model):
    __tablename__ = 'location'
    id = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    users = db.relationship('User', backref='location', lazy=True, cascade="all, delete")
    
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
    users = db.relationship('User', backref='hobbie', lazy=True, cascade="all, delete")

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
    description = db.Column(db.String(255))
    moods = db.relationship('Mood', backref='category_mood', lazy=True, uselist=False, cascade="all, delete")
    icon_url = db.Column(db.String(255))
    
    def __repr__(self):
        return '<CategoryMood %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "category": self.category,
            "description": self.description,
            "icon_url": self.icon_url
        }

class Mood(db.Model):
    __tablename__ = 'mood'
    id = db.Column(db.Integer, primary_key=True)
    mood = db.Column(db.String(255))
    category_id = db.Column(db.Integer, db.ForeignKey('category_mood.id'))
    response = db.Column(db.String(255))
    users = db.relationship('User', backref='mood', lazy=True, cascade="all, delete")
    
    def __repr__(self):
        return '<Mood %r>' % self.id

    def serialize(self):
        actions = Action.query.filter_by(category_id=self.category_id).all()
        category_mood = CategoryMood.query.filter_by(id=self.category_id).first()
        
        return {
            "mood_id": self.id,
            "mood": self.mood,
            "category_id": self.category_id,
            "response": self.response,
            "actions": [action.serialize() for action in actions] if actions else [],
            "category_mood": self.category_mood.serialize() if self.category_mood else None
        }

class UserMoodHistory(db.Model):
    __tablename__ = 'user_mood_history'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    date = db.Column(db.Date)
    mood_id = db.Column(db.Integer, db.ForeignKey('mood.id'))
    user = db.relationship('User', backref='user_mood_history', cascade="all, delete")
    mood = db.relationship('Mood', cascade="all, delete")
    
    def __repr__(self):
        return '<UserMoodHistory %r>' % self.id

    def serialize(self):
        mood_category = self.mood.category_mood.category if self.mood and self.mood.category_mood else None
        return {
            "mood_id": self.mood_id,
            "mood_category": mood_category,
        }

class Action(db.Model):
    __tablename__ = 'actions'
    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(255))
    description = db.Column(db.String(255))
    category_id = db.Column(db.Integer, db.ForeignKey('category_mood.id'))

    category = db.relationship('CategoryMood', backref='actions', cascade="all, delete")

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
    icon_url = db.Column(db.String(255))
    
    def __repr__(self):
        return '<ResourceType %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "resource_type": self.resource_type,
            "icon_url": self.icon_url
        }

class Resource(db.Model):
    __tablename__ = 'resource'
    id = db.Column(db.Integer, primary_key=True)
    resource_type_id = db.Column(db.Integer, db.ForeignKey('resource_type.id'))
    url = db.Column(db.String(255))
    title = db.Column(db.String(255))
    description = db.Column(db.String(255))
    phycologyst_id = db.Column(db.Integer, db.ForeignKey('phycologyst.id'))
    resource_type = db.relationship('ResourceType', backref='resource', cascade="all, delete")
    phycologyst = db.relationship('Phycologyst', backref='resource', cascade="all, delete")
    created_at = db.Column(db.DateTime)
    
    def __repr__(self):
        return '<Resource %r>' % self.id

    def serialize(self):
        info_physcologyst = Phycologyst.query.filter_by(id=self.phycologyst_id).first()
        print(info_physcologyst)
        return {
            "id": self.id,
            'resource_type': self.resource_type.resource_type if self.resource_type else None,
            "url": self.url,
            "description": self.description,
            "created_at": self.created_at,
            "psychologist_id": self.phycologyst_id,
            "phycologyst_info": None if info_physcologyst is None else info_physcologyst.serialize(),
            "title": self.title
        }

class Chat(db.Model):
    __tablename__ = 'chat'
    id = db.Column(db.Integer, primary_key=True)
    user_sender_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    user_reciver_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    message_text = db.Column(db.String(255))
    time = db.Column(db.DateTime)
    sender = db.relationship('User', foreign_keys=[user_sender_id], cascade="all, delete", backref='sent_messages')
    receiver = db.relationship('User', foreign_keys=[user_reciver_id], cascade="all, delete", backref='received_messages')
    
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
    collegiate_number = db.Column(db.String(255))
    biography = db.Column(db.String(1000))
    web = db.Column(db.String(255))
    users = db.relationship('User', backref='phycologyst', lazy=True, cascade="all, delete")
    profile_url = db.Column(db.String(255))
    
    def __repr__(self):
        return '<Phycologyst %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "surnames": self.surnames,
            "email": self.email,
            "experience": self.experience,
            "collegiate_number": self.collegiate_number,
            "biography": self.biography,
            "web": self.web,
            "profile_url" : self.profile_url
        }

class Sessions(db.Model):
    __tablename__ = 'sessions'
    id = db.Column(db.Integer, primary_key=True)
    phycologyst_id = db.Column(db.Integer, db.ForeignKey('phycologyst.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    phycologyst = db.relationship('Phycologyst', backref='sessions', cascade="all, delete")
    user = db.relationship('User', backref='sessions', cascade="all, delete")
    
    def __repr__(self):
        return '<Sessions %r>' % self.id
        

    def serialize(self):
        return {
            "id": self.id,
            "phycologyst_id": self.phycologyst_id,
            "user_id": self.user_id
        }

