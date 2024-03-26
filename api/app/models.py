from app import db
from typing import Optional
from datetime import datetime
import sqlalchemy.orm as so
import sqlalchemy as sa
from flask_jwt_extended import get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    email: so.Mapped[str] = so.mapped_column(sa.String(120), index=True, unique=True)
    password_hash: so.Mapped[Optional[str]] = so.mapped_column(sa.String(256))

    claims: so.WriteOnlyMapped["Claim"] = so.relationship(back_populates="author")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        if self.password_hash is None:
            return False
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return "<User {}>".format(self.email)


def load_user():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    return user


class Claim(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    user_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey(User.id), index=True)
    date_of_accident: so.Mapped[datetime] = so.mapped_column(sa.DateTime)
    accident_type: so.Mapped[str] = so.mapped_column(sa.String(64))
    description: so.Mapped[str] = so.mapped_column(sa.String(256))
    injuries_reported: so.Mapped[bool] = so.mapped_column(sa.Boolean)
    damage_details: so.Mapped[str] = so.mapped_column(sa.String(256))

    author: so.Mapped[User] = so.relationship(back_populates="claims")
    images: so.WriteOnlyMapped["Image"] = so.relationship(back_populates="claim")

    def __repr__(self):
        return "<Claim {}>".format(self.id)

    def to_dict(self):
        session = so.Session.object_session(self)
        stmt = sa.select(Image).where(Image.claim_id == self.id)
        images = session.execute(stmt).scalars().all()

        return {
            "id": self.id,
            "user_id": self.user_id,
            "date_of_accident": self.date_of_accident,
            "accident_type": self.accident_type,
            "description": self.description,
            "injuries_reported": self.injuries_reported,
            "damage_details": self.damage_details,
            "author": self.author.id if self.author else None,
            "images": [image.id for image in images],
        }


class Image(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    claim_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey(Claim.id), index=True)
    image_file: so.Mapped[str] = so.mapped_column(sa.String(256))

    claim: so.Mapped[Claim] = so.relationship(back_populates="images")

    def __repr__(self):
        return "<Image {}>".format(self.id)
