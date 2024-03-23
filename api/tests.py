import pytest
from flask_jwt_extended import create_refresh_token, create_access_token
from flask import jsonify
from config import TestConfig
from app import create_app, db
from app.models import User


@pytest.fixture
def client():
    app = create_app(TestConfig)

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()


def test_register_new_user(client):
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
    # Act
    response = client.get("/api/auth/whoami")

    # Assert
    assert response.status_code == 401
    assert "email" not in response.get_json()


def test_whoami_with_invalid_token(mocker, client):
    # Act
    response = client.get(
        "/api/auth/whoami", headers={"Authorization": "Bearer invalid_token"}
    )

    # Assert
    assert response.status_code == 401
    assert "email" not in response.get_json()


def test_refresh(mocker, client):
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
    # Act
    response = client.post(
        "/api/auth/refresh", headers={"Authorization": "Bearer invalid_token"}
    )

    # Assert
    assert response.status_code == 401
    assert "access_token" not in response.get_json()


def test_refresh_without_token(client):
    # Act
    response = client.post("/api/auth/refresh")

    # Assert
    assert response.status_code == 401
    assert "access_token" not in response.get_json()
