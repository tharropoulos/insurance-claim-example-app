from app import db, jwt, supabase
from app.helpers import validate_files
from app.schemas import ClaimCreate
from flask import request, jsonify, Blueprint, current_app as app, send_from_directory
from sqlalchemy import desc
from sqlalchemy.orm import joinedload
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
)
from werkzeug.utils import secure_filename
from app.models import User, Image, Claim, load_user
from pydantic import ValidationError
import os
import tempfile


bp = Blueprint("main", __name__)


@bp.route("/api/auth/register", methods=["POST"])
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


@bp.route("/api/auth/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    current_user = load_user()
    new_token = create_access_token(identity=current_user.email)
    return jsonify({"access_token": new_token}), 200


@bp.route("/api/auth/login", methods=["POST"])
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


@bp.route("/api/auth/whoami", methods=["GET"])
@jwt_required()
def whoami():
    user = load_user()
    return jsonify({"email": user.email}), 200


@bp.route("/api/claims", methods=["POST"])
@jwt_required()
def create_claim():
    claim_data = {key: request.form.get(key) for key in request.form.keys()}
    file_data = {key: request.files.get(key) for key in request.files.keys()}

    user = load_user()

    if user is None:
        return jsonify({"error": "User not found"}), 404

    try:
        claim = ClaimCreate(**claim_data)
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 400

    valid, files_or_error = validate_files(request)

    if not valid:
        return jsonify({"error": files_or_error}), 400

    claim = Claim(
        user_id=user.id,
        date_of_accident=claim.date_of_accident,
        accident_type=claim.accident_type,
        description=claim.description,
        injuries_reported=claim.injuries_reported,
        damage_details=claim.damage_details,
        policy_number=claim.policy_number,
    )

    db.session.add(claim)
    db.session.commit()

    images = []
    for file in files_or_error:
        try:
            with tempfile.NamedTemporaryFile(delete=False) as temp:
                file.save(temp.name)
                filename = secure_filename(file.filename.replace(" ", "_"))
                supabase.client.storage.from_(
                    app.config.get("SUPABASE_STORAGE_BUCKET")
                ).upload(filename, temp.name)
                os.unlink(temp.name)
            # file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
            image = Image(claim_id=claim.id, image_file=filename)
            images.append(image)
        except Exception as e:
            print(f"Exception while handling file: {e}")
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    if len(images) > 0:
        db.session.bulk_save_objects(images)

    db.session.commit()

    access_token = create_access_token(identity=user.id)

    return (
        jsonify(
            {
                "message": "Claim created successfully",
                "claim_id": claim.id,
                "access_token": access_token,
            }
        ),
        201,
    )


@bp.route("/api/claims", methods=["GET"])
@jwt_required()
def get_claims():
    user = load_user()

    if user is None:
        return jsonify({"error": "User not found"}), 404

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    claims = (
        Claim.query.options(joinedload(Claim.images))
        .filter_by(user_id=user.id)
        .order_by(desc(Claim.id))
        .paginate(page=page, per_page=per_page, error_out=False)
    )

    claims_items = [claim.to_dict() for claim in claims.items]

    return (
        jsonify(
            {
                "claims": claims_items,
                "total": claims.total,
                "pages": claims.pages,
                "current_page": claims.page,
            }
        ),
        200,
    )
