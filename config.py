import os

class Config:
    SECRET_KEY = "FreeLix-SecretKey-2025-04-13"
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USERNAME = "manan003009@gmail.com"
    MAIL_PASSWORD = "njtk aept ohdk wcfq"
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_DEFAULT_SENDER = "manan003009@gmail.com"
    
    # SQLite Database Configuration
    SQLALCHEMY_DATABASE_URI = 'sqlite:///freelix.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///dev_freelix.db'

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///test_freelix.db'

class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///prod_freelix.db'

# Dictionary with different configuration environments
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}