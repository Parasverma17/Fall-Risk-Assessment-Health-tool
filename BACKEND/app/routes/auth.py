from flask import Blueprint, request, redirect, session, jsonify, current_app, make_response
import requests
import urllib.parse
import secrets
from jose import jwt
from datetime import datetime, timedelta

auth_bp = Blueprint('auth', __name__)

def create_jwt_token(patient_id, access_token, token_type='Bearer'):
    """Create JWT token with patient session data"""
    payload = {
        'patient_id': patient_id,
        'access_token': access_token,
        'token_type': token_type,
        'exp': datetime.utcnow() + timedelta(hours=24),
        'iat': datetime.utcnow()
    }
    secret = current_app.config['SECRET_KEY']
    return jwt.encode(payload, secret, algorithm='HS256')

def verify_jwt_token(token):
    """Verify and decode JWT token"""
    try:
        secret = current_app.config['SECRET_KEY']
        payload = jwt.decode(token, secret, algorithms=['HS256'])
        return payload
    except Exception as e:
        print(f"JWT verification failed: {e}")
        return None

def generate_state():
    return secrets.token_urlsafe(16)

@auth_bp.route('/launch')
def launch():
    """SMART app launch endpoint"""
    iss = request.args.get('iss')
    launch = request.args.get('launch')

    if not iss or not launch:
        return jsonify({'error': 'Missing launch parameters'}), 400

    # Store launch parameters
    session['iss'] = iss
    session['launch'] = launch

    # Generate state for OAuth security
    state = generate_state()
    session['oauth_state'] = state

    # Build authorization URL
    auth_params = {
        'response_type': 'code',
        'client_id': current_app.config['CLIENT_ID'],
        'redirect_uri': current_app.config['REDIRECT_URI'],
        'scope': ' '.join(current_app.config['SCOPES']),
        'state': state,
        'aud': iss,
        'launch': launch
    }

    auth_url = f"{current_app.config['AUTHORIZATION_ENDPOINT']}?{urllib.parse.urlencode(auth_params)}"

    return redirect(auth_url)

@auth_bp.route('/callback', methods=['GET', 'POST'])
def callback():
    """OAuth callback endpoint - handles both GET (from SMART launcher) and POST (from React)"""
    
    if request.method == 'GET':
        code = request.args.get('code')
        state = request.args.get('state')
        
        if not code:
            frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:3000')
            return redirect(f"{frontend_url}/error?message=Authorization failed - no code")
        
        try:
            token_data = exchange_code_for_token(code)
            session['access_token'] = token_data.get('access_token')
            session['token_type'] = token_data.get('token_type', 'Bearer')
            
            patient_id = token_data.get('patient')
            
            if not patient_id and 'access_token' in token_data:
                userinfo_url = current_app.config.get('USERINFO_ENDPOINT')
                if userinfo_url:
                    resp = requests.get(
                        userinfo_url,
                        headers={'Authorization': f"Bearer {token_data['access_token']}"}
                    )
                    if resp.ok:
                        userinfo = resp.json()
                        patient_id = userinfo.get('patient')
            
            if not patient_id:
                frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:3000')
                return redirect(f"{frontend_url}/error?message=No patient context found")
            
            # Create JWT token with session data
            jwt_token = create_jwt_token(
                patient_id=patient_id,
                access_token=token_data.get('access_token'),
                token_type=token_data.get('token_type', 'Bearer')
            )
            
            print(f"JWT created for patient_id={patient_id}")
            
            # Redirect to frontend with JWT token in URL
            frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:3000')
            return redirect(f"{frontend_url}/patient-info?token={jwt_token}")
            
        except Exception as e:
            frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:3000')
            return redirect(f"{frontend_url}/error?message={str(e)}")
    
    else:
        data = request.json
        code = data.get('code')

        if not code:
            return jsonify({'error': 'Authorization failed'}), 400

        try:
            token_data = exchange_code_for_token(code)
            session['access_token'] = token_data.get('access_token')
            session['token_type'] = token_data.get('token_type', 'Bearer')

            patient_id = token_data.get('patient')

            if not patient_id and 'access_token' in token_data:
                userinfo_url = current_app.config.get('USERINFO_ENDPOINT')
                if userinfo_url:
                    resp = requests.get(
                        userinfo_url,
                        headers={'Authorization': f"Bearer {token_data['access_token']}"}
                    )
                    if resp.ok:
                        userinfo = resp.json()
                        patient_id = userinfo.get('patient')

            if not patient_id:
                return jsonify({'error': 'No patient context found in token or userinfo'}), 400

            session['patient_id'] = patient_id
            session['current_assessment'] = None
            
            return jsonify({'success': True})

        except Exception as e:
            return jsonify({'error': f'Token exchange failed: {str(e)}'}), 500

def exchange_code_for_token(code: str) -> dict:
    """Exchange authorization code for access token"""
    token_data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': current_app.config['REDIRECT_URI'],
        'client_id': current_app.config['CLIENT_ID']
    }

    if current_app.config['CLIENT_SECRET']:
        token_data['client_secret'] = current_app.config['CLIENT_SECRET']

    response = requests.post(
        current_app.config['TOKEN_ENDPOINT'],
        data=token_data,
        headers={'Accept': 'application/json'}
    )

    response.raise_for_status()
    return response.json()

@auth_bp.route('/verify-token', methods=['POST'])
def verify_token():
    """Verify JWT token and return patient info"""
    data = request.json
    token = data.get('token')
    
    if not token:
        return jsonify({'error': 'Missing token'}), 400
    
    payload = verify_jwt_token(token)
    
    if not payload:
        return jsonify({'error': 'Invalid or expired token'}), 401
    
    return jsonify({
        'success': True,
        'patient_id': payload.get('patient_id'),
        'access_token': payload.get('access_token'),
        'token_type': payload.get('token_type')
    })

@auth_bp.route('/logout')
def logout():
    """Clear session and logout"""
    session.clear()
    return jsonify({'message': 'Logged out successfully'})