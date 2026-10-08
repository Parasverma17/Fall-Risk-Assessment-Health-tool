from flask import Flask
from flask_cors import CORS
from flask_session import Session
from app.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS with credentials support
    # Use wildcard in production, specific origins in development
    cors_config = {
        "origins": Config.CORS_ORIGINS,
        "supports_credentials": True,
        "allow_headers": ["Content-Type", "Authorization"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "expose_headers": ["Content-Type"]
    }
    
    CORS(app, resources={r"/*": cors_config})
    
    # Log CORS origins for debugging
    print(f"CORS enabled for origins: {Config.CORS_ORIGINS}")
    
    # Initialize server-side session
    Session(app)
    
    # Upload bundle to FHIR server on startup
    try:
        from app.services.bundle_uploader import upload_bundle_to_fhir
        upload_bundle_to_fhir()
    except Exception as e:
        print(f"Note: Could not upload bundle on startup - {str(e)}")
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.patient import patient_bp
    from app.routes.assessment import assessment_bp
    
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(patient_bp, url_prefix='/patient')
    app.register_blueprint(assessment_bp, url_prefix='/assessment')
    
    return app
