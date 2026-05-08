from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "nmit_secret"
ALGORITHM = "HS256"

def create_token(user, role):

    payload = {
        "user": user,
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=5)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return token