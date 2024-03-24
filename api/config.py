import os
from os.path import dirname as up
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
env = os.path.join(up(basedir), ".env")
load_dotenv(env)


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "you-will-never-guess"
    SQLALCHEMY_DATABASE_URI = (
        f"sqlite+{os.environ.get('TURSO_DATABASE_URL')}/?authToken={os.environ.get('TURSO_AUTH_TOKEN')}&secure=true"
        or "sqlite:///" + os.path.join(basedir, "app.db")
    )
    print(SQLALCHEMY_DATABASE_URI)
    SQLALCHEMY_ENGINE_OPTIONS = {
        "connect_args": {"check_same_thread": False, "timeout": 30},
        "echo": True,
    }
    UPLOAD_FOLDER = os.path.join(basedir, "uploads")


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
