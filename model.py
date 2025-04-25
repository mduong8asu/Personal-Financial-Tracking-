from extensions import db  # Import db from extensions.py

class User(db.Model):
    __tablename__ = 'user'  # Specifies the table name

    # Define the columns for the 'user' table
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Primary key
    email = db.Column(db.String(255), unique=True, nullable=False)  # Email field, unique and required
    password = db.Column(db.String(255), nullable=False)  # Password field, required (hashed)
    description = db.Column(db.Text, nullable=True)  # Description field, optional text
    admin = db.Column(db.Boolean, default=False, nullable=False)  # Admin field, boolean, default is False

    # String representation of the User object for debugging
    def __repr__(self):
        return f'<User {self.email}>'

class Chatroom(db.Model):
    __tablename__ = 'chatroom'  # Specifies the table name

    # Define the columns for the 'chatroom' table
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Primary key
    name = db.Column(db.String(255), nullable=False)  # Name field, required
    description = db.Column(db.Text, nullable=True)  # Description field, optional text
    cost = db.Column(db.Text, nullable=False) # Cost is required input

    # String representation of the Chatroom object for debugging
    def __repr__(self):
        return f'<Chatroom {self.name}>'
    
class Expense(db.Model):
    __tablename__ = 'expense'  # Specifies the table name

    # Define the columns for the 'expense' table
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Primary key
    name = db.Column(db.String(255), nullable=False)  # Name of the expense, required
    amount = db.Column(db.Numeric(10, 2), nullable=False)  # Amount field from schema
    chatroom_id = db.Column(db.Integer, db.ForeignKey('chatroom.id'), nullable=False)  # Foreign key to chatroom
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to user
    created_at = db.Column(db.DateTime, server_default=db.func.now())  # Timestamp when the record is created
    cost = db.Column(db.Numeric(10, 2), nullable=True)  # Cost field from schema

    # Relationships
    chatroom = db.relationship('Chatroom', backref=db.backref('expenses', cascade='all, delete-orphan'))  # Relationship to Chatroom
    user = db.relationship('User', backref=db.backref('expenses', cascade='all, delete-orphan'))  # Relationship to User

    # String representation of the Expense object for debugging
    def __repr__(self):
        return f'<Expense {self.name}, Amount: {self.amount}, Cost: {self.cost}>'