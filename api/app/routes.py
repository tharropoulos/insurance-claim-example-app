from app import app, db, jwt
from flask import request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    exceptions,
)
from app.models import User, load_user


@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter(User.email == email).first()

    if user is not None:
        return jsonify({"error": "User already exists"}), 400

    user = User(email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=user.email)
    refresh_token = create_refresh_token(identity=user.email)

    return (
        jsonify(
            {
                "message": "User created successfully",
                "access_token": access_token,
                "refresh_token": refresh_token,
            }
        ),
        200,
    )


@jwt.invalid_token_loader
def invalid_token_callback(jwt_header, jwt_payload=None):
    return jsonify({"message": "Invalid token"}), 401


@app.route("/api/auth/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    current_user = load_user()
    new_token = create_access_token(identity=current_user.email)
    return jsonify({"access_token": new_token}), 200


@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    user = User.query.filter_by(email=email).first()

    if user is None or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.email)
    refresh_token = create_refresh_token(identity=user.email)

    if access_token:
        return (
            jsonify(
                {
                    "message": "Logged in successfully",
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                }
            ),
            200,
        )
    return jsonify({"error": "Login failed"}), 500


@app.route("/api/auth/whoami", methods=["GET"])
@jwt_required()
def whoami():
    user = load_user()
    return jsonify({"email": user.email}), 200
