class Config:
    # Basic configuration for the Flask application
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://cis440fall24team1:cis440fall24team1@107.180.1.16:3306/cis440fall24team1'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = '<a word or phrase used to encrypt>'  # You should replace this with a stronger key in production