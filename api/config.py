import os
from os.path import dirname as up
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
env = os.path.join(basedir, ".env")
load_dotenv(env)


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "you-will-never-guess"
    SQLALCHEMY_DATABASE_URI = (
        os.environ.get("DATABASE_URL")
    ) or "sqlite:///" + os.path.join(basedir, "app.db")
    UPLOAD_FOLDER = os.path.join(basedir, "uploads")
    SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
    SUPABASE_URL = os.environ.get("SUPABASE_URL")
    SUPABASE_STORAGE_BUCKET = os.environ.get("SUPABASE_STORAGE_BUCKET")


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
    SUPABASE_URL = os.environ.get("SUPABASE_URL")
    SUPABASE_STORAGE_BUCKET = os.environ.get("SUPABASE_TEST_STORAGE_BUCKET")
