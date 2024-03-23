from app import db
from typing import Optional
import sqlalchemy.orm as so
import sqlalchemy as sa
from flask_jwt_extended import get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    email: so.Mapped[str] = so.mapped_column(sa.String(120), index=True, unique=True)
    password_hash: so.Mapped[Optional[str]] = so.mapped_column(sa.String(256))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        if self.password_hash is None:
            return False
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return "<User {}>".format(self.policy_number)


def load_user():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    return user
