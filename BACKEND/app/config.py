import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Environment URLs
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
    BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:5000')
    
    # SMART on FHIR Configuration
    CLIENT_ID = os.getenv('CLIENT_ID', 'your-client-id')
    CLIENT_SECRET = os.getenv('CLIENT_SECRET', '')
    REDIRECT_URI = os.getenv('REDIRECT_URI', f"{BACKEND_URL}/auth/callback")
    FHIR_BASE_URL = os.getenv('FHIR_SERVER_URL', 'https://launch.smarthealthit.org/v/r4/fhir')
    AUTHORIZATION_ENDPOINT = "https://launch.smarthealthit.org/v/r4/auth/authorize"
    TOKEN_ENDPOINT = "https://launch.smarthealthit.org/v/r4/auth/token"
    USERINFO_ENDPOINT = "https://launch.smarthealthit.org/v/r4/userinfo"
    SCOPES = [
        "openid", "profile", "user/*.*", "patient/*.*", "launch", "offline_access"
    ]
    
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # Session Configuration
    SESSION_TYPE = 'filesystem'
    SESSION_COOKIE_SECURE = os.getenv('SESSION_COOKIE_SECURE', 'False').lower() == 'true'
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'None' if SESSION_COOKIE_SECURE else 'Lax'
    SESSION_COOKIE_NAME = 'frat_session'
    # Important: Set domain to None to allow cross-site cookies
    SESSION_COOKIE_DOMAIN = None
    SESSION_COOKIE_PATH = '/'
    
    # CORS Configuration
    cors_env = os.getenv('CORS_ORIGINS', 'http://localhost:3000')
    CORS_ORIGINS = [origin.strip() for origin in cors_env.split(',') if origin.strip()]