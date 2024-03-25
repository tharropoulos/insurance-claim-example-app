import pytest
from flask_jwt_extended import create_refresh_token, create_access_token
from flask import jsonify
from config import TestConfig
from app import create_app, db, supabase
from app.models import User, Claim
from werkzeug.datastructures import FileStorage
import io


@pytest.fixture
def client():
    app = create_app(TestConfig)

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client, app
            db.session.remove()
            db.drop_all()
            supabase.client.storage.empty_bucket(
                app.config.get("SUPABASE_STORAGE_BUCKET")
            )


def test_register_new_user(client):
    client, app = client
    # Act
    response = client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "testpassword"},
    )

    user = User.query.filter(User.email == "test@example.com").first()

    # Assert
    assert response.status_code == 200
    assert user.email == "test@example.com"
    assert response.get_json()["message"] == "User created successfully"


def test_register_duplicate_user(client):
    client, app = client
    # Arrange
    client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "testpassword"},
    )

    # Act
    response = client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "testpassword"},
    )

    # Assert
    assert response.status_code == 400
    assert response.get_json()["error"] == "User already exists"


def test_login_existing_user(client):
    client, app = client
    # Arrange
    user = User(email="test@example.com")
    user.set_password("testpassword")
    db.session.add(user)
    db.session.commit()

    # Act
    response = client.post(
        "/api/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )

    # Assert
    assert response.status_code == 200
    assert "access_token" in response.get_json()
    assert "refresh_token" in response.get_json()


def test_login_non_existing_user(client):
    client, app = client
    # Act
    response = client.post(
        "/api/auth/login",
        json={"email": "nonexisting@example.com", "password": "wrongpassword"},
    )

    # Assert
    assert response.status_code == 401
    assert response.get_json()["error"] == "Invalid credentials"


# TODO: make this truly a unit test, by mocking the load_user function
def test_whoami(mocker, client):
    client, app = client
    # Arrange
    mock_user = User(email="test@example.com")
    mocker.patch("app.routes.load_user", return_value=mock_user)

    mocker.patch("flask_jwt_extended.get_jwt_identity", return_value=mock_user.email)

    access_token = create_access_token(identity=mock_user.email)

    # Act
    response = client.get(
        "/api/auth/whoami", headers={"Authorization": f"Bearer {access_token}"}
    )

    # Assert
    assert response.status_code == 200
    assert response.get_json() == {"email": "test@example.com"}


def test_whoami_without_token(client):
    client, app = client
    # Act
    response = client.get("/api/auth/whoami")

    # Assert
    assert response.status_code == 401
    assert "email" not in response.get_json()


def test_whoami_with_invalid_token(mocker, client):
    client, app = client
    # Act
    response = client.get(
        "/api/auth/whoami", headers={"Authorization": "Bearer invalid_token"}
    )

    # Assert
    assert response.status_code == 401
    assert "email" not in response.get_json()


def test_refresh(mocker, client):
    client, app = client
    # Arrange
    mock_user = User(email="test@example.com")
    mocker.patch("app.routes.load_user", return_value=mock_user)

    mocker.patch("flask_jwt_extended.get_jwt_identity", return_value=mock_user.email)

    refresh_token = create_refresh_token(identity=mock_user.email)

    # Act
    response = client.post(
        "/api/auth/refresh", headers={"Authorization": f"Bearer {refresh_token}"}
    )

    # Assert
    assert response.status_code == 200
    assert "access_token" in response.get_json()


def test_refresh_with_invalid_token(client):
    client, app = client
    # Act
    response = client.post(
        "/api/auth/refresh", headers={"Authorization": "Bearer invalid_token"}
    )

    # Assert
    assert response.status_code == 401
    assert "access_token" not in response.get_json()


def test_refresh_without_token(client):
    client, app = client
    # Act
    response = client.post("/api/auth/refresh")

    # Assert
    assert response.status_code == 401
    assert "access_token" not in response.get_json()


def test_create_claim(mocker, client):
    client, app = client
    # Arrange
    mock_user = User(email="test@example.com")
    db.session.add(mock_user)
    db.session.commit()
    mocker.patch("app.routes.load_user", return_value=mock_user)

    image_name = "none-image.jpg"
    image_contents = b"some data"
    mocker.patch("flask_jwt_extended.get_jwt_identity", return_value=mock_user.email)
    access_token = create_access_token(identity=mock_user.email)
    data = {
        "policy_number": "who",
        "date_of_accident": "2024-03-24T22:00:00.000Z",
        "accident_type": "an",
        "description": "i",
        "damage_details": "lol",
        "injuries_reported": True,
        "images[0]": FileStorage(
            stream=io.BytesIO(image_contents),
            filename=image_name,
            content_type="image/jpeg",
        ),
    }
    headers = {"Authorization": f"Bearer {access_token}"}

    # Act
    response = client.post(
        "/api/claims", data=data, headers=headers, content_type="multipart/form-data"
    )
    # Assert
    assert response.status_code == 201  # check status code
    json_data = response.get_json()
    assert json_data["message"] == "Claim created successfully"
    assert "claim_id" in json_data
    assert "access_token" in json_data

    # Check that the claim was added to the database
    claim = Claim.query.filter(Claim.id == "1").first()
    assert claim is not None
    assert claim.accident_type == data["accident_type"]
    assert claim.description == data["description"]

    image = supabase.client.storage.from_(
        app.config.get("SUPABASE_STORAGE_BUCKET")
    ).download(image_name)

    assert image is not None
    assert image == image_contents


def test_create_claim_no_auth(mocker, client):
    client, app = client
    # Arrange
    image_name = "none-image.jpg"
    image_contents = b"some data"
    data = {
        "policy_number": "who",
        "date_of_accident": "2024-03-24T22:00:00.000Z",
        "accident_type": "an",
        "description": "i",
        "damage_details": "lol",
        "injuries_reported": True,
        "images[0]": FileStorage(
            stream=io.BytesIO(image_contents),
            filename=image_name,
            content_type="image/jpeg",
        ),
    }
    headers = {"Authorization": f"Bearer no-token"}

    # Act
    response = client.post(
        "/api/claims", data=data, headers=headers, content_type="multipart/form-data"
    )
    # Assert
    assert response.status_code == 401


def test_create_claim_wrong_file_type(mocker, client):
    client, app = client
    # Arrange
    mock_user = User(email="test@example.com")
    db.session.add(mock_user)
    db.session.commit()
    mocker.patch("app.routes.load_user", return_value=mock_user)

    image_name = "none-image.jpg"
    image_contents = b"some data"
    mocker.patch("flask_jwt_extended.get_jwt_identity", return_value=mock_user.email)
    access_token = create_access_token(identity=mock_user.email)
    data = {
        "policy_number": "who",
        "date_of_accident": "2024-03-24T22:00:00.000Z",
        "accident_type": "an",
        "description": "i",
        "damage_details": "lol",
        "injuries_reported": True,
        "images[0]": FileStorage(
            stream=io.BytesIO(image_contents),
            filename=image_name,
            content_type="video/mp4",
        ),
    }
    headers = {"Authorization": f"Bearer {access_token}"}

    # Act
    response = client.post(
        "/api/claims", data=data, headers=headers, content_type="multipart/form-data"
    )

    # Assert
    assert response.status_code == 400
    assert response.get_json()["error"] == "File type not allowed"


def test_create_claim_missing_file(mocker, client):
    client, app = client
    # Arrange
    mock_user = User(email="test@example.com")
    db.session.add(mock_user)
    db.session.commit()
    mocker.patch("app.routes.load_user", return_value=mock_user)

    mocker.patch("flask_jwt_extended.get_jwt_identity", return_value=mock_user.email)
    access_token = create_access_token(identity=mock_user.email)
    data = {
        "policy_number": "who",
        "date_of_accident": "2024-03-24T22:00:00.000Z",
        "accident_type": "an",
        "description": "i",
        "damage_details": "lol",
        "injuries_reported": True,
    }
    headers = {"Authorization": f"Bearer {access_token}"}

    # Act
    response = client.post(
        "/api/claims", data=data, headers=headers, content_type="multipart/form-data"
    )

    # Assert
    assert response.status_code == 400
    assert response.get_json()["error"] == "No file part in the request"


def test_create_claim_missing_property(mocker, client):
    client, app = client
    # Arrange
    mock_user = User(email="test@example.com")
    db.session.add(mock_user)
    db.session.commit()
    mocker.patch("app.routes.load_user", return_value=mock_user)

    image_name = "none-image.jpg"
    image_contents = b"some data"
    mocker.patch("flask_jwt_extended.get_jwt_identity", return_value=mock_user.email)
    access_token = create_access_token(identity=mock_user.email)
    data = {
        "policy_number": "who",
        "date_of_accident": "2024-03-24T22:00:00.000Z",
        "description": "i",
        "damage_details": "lol",
        "injuries_reported": True,
        "images[0]": FileStorage(
            stream=io.BytesIO(image_contents),
            filename=image_name,
            content_type="image/jpeg",
        ),
    }
    headers = {"Authorization": f"Bearer {access_token}"}

    # Act
    response = client.post(
        "/api/claims", data=data, headers=headers, content_type="multipart/form-data"
    )

    # Assert
    assert response.status_code == 400
