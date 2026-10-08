from flask import Blueprint, jsonify, session, request, current_app
from app.services.fhir_client import FHIRClient
from jose import jwt

patient_bp = Blueprint('patient', __name__)

def get_auth_from_request():
    """Extract auth data from JWT token in Authorization header or fallback to session"""
    # Try JWT token first (new method)
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        try:
            secret = current_app.config['SECRET_KEY']
            payload = jwt.decode(token, secret, algorithms=['HS256'])
            return {
                'patient_id': payload.get('patient_id'),
                'access_token': payload.get('access_token'),
                'token_type': payload.get('token_type', 'Bearer')
            }
        except Exception as e:
            print(f"JWT decode failed: {e}")
    
    # Fallback to session (old method, for backward compatibility)
    if 'access_token' in session and 'patient_id' in session:
        return {
            'patient_id': session.get('patient_id'),
            'access_token': session.get('access_token'),
            'token_type': session.get('token_type', 'Bearer')
        }
    
    return None

@patient_bp.route('/info')
def patient_info():
    """Get patient info and related resources from FHIR server (no assessment logic)"""
    auth = get_auth_from_request()
    
    if not auth:
        return jsonify({'error': 'Not authenticated'}), 401
    
    if not auth.get('patient_id'):
        return jsonify({'error': 'No patient selected'}), 400

    try:
        print(f"Fetching patient with ID: {auth['patient_id']}")
        fhir_client = FHIRClient()
        data = fhir_client.extract_patient_resources(
            auth['patient_id'],
            auth['access_token']
        )
        return jsonify({
            'success': True,
            'patient': data.get('patient'),
            'conditions': data.get('conditions', []),
            'medications': data.get('medications', []),
            'observations': data.get('observations', []),
            'immunizations': data.get('immunizations', [])
        })
    except Exception as e:
        print("Error in /patient/info:", e)
        return jsonify({'error': f'Failed to retrieve patient data: {str(e)}'}), 500

@patient_bp.route('/conditions')
def patient_conditions():
    """Get all patient conditions from FHIR server"""
    auth = get_auth_from_request()
    
    if not auth:
        return jsonify({'error': 'Not authenticated'}), 401
    
    if not auth.get('patient_id'):
        return jsonify({'error': 'No patient selected'}), 400

    try:
        fhir_client = FHIRClient()
        conditions = fhir_client.get_patient_conditions(
            auth['patient_id'],
            auth['access_token']
        )
        return jsonify({
            'success': True,
            'conditions': conditions
        })
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve conditions: {str(e)}'}), 500

@patient_bp.route('/medications')
def patient_medications():
    """Get all patient medications from FHIR server"""
    auth = get_auth_from_request()
    
    if not auth:
        return jsonify({'error': 'Not authenticated'}), 401
    
    if not auth.get('patient_id'):
        return jsonify({'error': 'No patient selected'}), 400

    try:
        fhir_client = FHIRClient()
        medications = fhir_client.get_patient_medications(
            auth['patient_id'],
            auth['access_token']
        )
        return jsonify({
            'success': True,
            'medications': medications
        })
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve medications: {str(e)}'}), 500

@patient_bp.route('/observations')
def patient_observations():
    """Get all patient observations from FHIR server"""
    auth = get_auth_from_request()
    
    if not auth:
        return jsonify({'error': 'Not authenticated'}), 401
    
    if not auth.get('patient_id'):
        return jsonify({'error': 'No patient selected'}), 400

    try:
        fhir_client = FHIRClient()
        observations = fhir_client.get_patient_observations(
            auth['patient_id'],
            auth['access_token']
        )
        return jsonify({
            'success': True,
            'observations': observations
        })
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve observations: {str(e)}'}), 500

@patient_bp.route('/immunizations')
def patient_immunizations():
    """Get all patient immunizations from FHIR server"""
    auth = get_auth_from_request()
    
    if not auth:
        return jsonify({'error': 'Not authenticated'}), 401
    
    if not auth.get('patient_id'):
        return jsonify({'error': 'No patient selected'}), 400

    try:
        fhir_client = FHIRClient()
        immunizations = fhir_client.get_patient_immunizations(
            auth['patient_id'],
            auth['access_token']
        )
        return jsonify({
            'success': True,
            'immunizations': immunizations
        })
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve immunizations: {str(e)}'}), 500