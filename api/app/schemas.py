from typing import List
from pydantic import BaseModel
from datetime import datetime


class ClaimBase(BaseModel):
    policy_number: str
    date_of_accident: datetime
    accident_type: str
    description: str
    injuries_reported: bool
    damage_details: str


class ClaimCreate(ClaimBase):
    pass


class ImageBase(BaseModel):
    image_file: str


class ImageCreate(ImageBase):
    pass


class Image(ImageBase):
    id: int
    claim_id: int

    class Config:
        orm_mode = True


class Claim(ClaimBase):
    id: int
    user_id: int
    images: List[Image] = []

    class Config:
        orm_mode = True
