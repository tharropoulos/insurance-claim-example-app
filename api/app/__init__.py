from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from supabase import create_client, Client

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


class SupabaseClient:
    def __init__(self):
        self.client = None

    def init_app(self, app):
        url = app.config.get("SUPABASE_URL")
        key = app.config.get("SUPABASE_KEY")
        self.client: Client = create_client(url, key)


supabase = SupabaseClient()


def create_app(config_class=Config):
    app = Flask(__name__)
    CORS(
        app,
        origins=[
            "https://insurance-claim-example-app.vercel.app",
            "http://localhost:3000",
        ],
    )
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    supabase.init_app(app)

    from app import models, schemas, helpers

    from app.routes import bp as main_bp

    app.register_blueprint(main_bp)

    return app


app = create_app()
