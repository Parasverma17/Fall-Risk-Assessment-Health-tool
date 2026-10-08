# from flask import Blueprint, request, jsonify, session
# import os
# import json

# assessment_bp = Blueprint('assessment', __name__, url_prefix='/assessment')

# ASSESSMENT_DIR = os.path.join(os.path.dirname(__file__), '../../data/assessments')
# os.makedirs(ASSESSMENT_DIR, exist_ok=True)

# def get_assessment_path(patient_id):
#     return os.path.join(ASSESSMENT_DIR, f"{patient_id}_assessment.json")

# @assessment_bp.route('/draft', methods=['GET'])
# def get_assessment_draft():
#     draft = session.get('current_assessment')
#     if draft:
#         return jsonify({"part1": draft.get("part1", {}), "part2": draft.get("part2", {})})
#     return jsonify({"part1": {}, "part2": {}})

# @assessment_bp.route('/draft', methods=['POST'])
# def save_assessment_draft():
#     data = request.json
#     session['current_assessment'] = data
#     return jsonify({"message": "Draft saved"})

# @assessment_bp.route('/submit', methods=['POST'])
# def submit_assessment():
#     data = request.json
#     patient_id = session.get('patient_id', 'unknown')
#     # Save assessment data as JSON file
#     with open(get_assessment_path(patient_id), "w") as f:
#         json.dump(data, f)
#     session['assessment_result'] = data  # Optionally keep in session
#     return jsonify({"message": "Assessment submitted"})

# @assessment_bp.route('/result', methods=['GET'])
# def get_assessment_result():
#     patient_id = session.get('patient_id', 'unknown')
#     path = get_assessment_path(patient_id)
#     if os.path.exists(path):
#         with open(path, "r") as f:
#             result = json.load(f)
#         return jsonify(result)
#     return jsonify({"error": "No assessment result found"}), 404

# @assessment_bp.route('/save', methods=['POST'])
# def save_to_patient_record():
#     # Here you would call FHIR client to save to EHR
#     return jsonify({"message": "Assessment saved to patient record"})




from flask import Blueprint, request, jsonify, session, current_app
import os
import json
from app.services.fhir_client import FHIRClient
from jose import jwt

assessment_bp = Blueprint('assessment', __name__, url_prefix='/assessment')

def get_auth_from_request():
    """Extract auth data from JWT token in Authorization header or fallback to session"""
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
    
    if 'access_token' in session and 'patient_id' in session:
        return {
            'patient_id': session.get('patient_id'),
            'access_token': session.get('access_token'),
            'token_type': session.get('token_type', 'Bearer')
        }
    
    return None

ASSESSMENT_FILE = os.path.join(os.path.dirname(__file__), '../../data/assessments/all_assessments.json')

def get_option_labels():
    return {
        "part1": {
            "recentFalls": {
                "none": "None in last 12 months",
                "3to12": "One or more between 3-12 months ago",
                "3mo": "One or more in last 3 months",
                "inpatient": "One or more in last 3 months while inpatient/resident"
            },
            "highRiskMeds": {
                "none": "Not taking any of these medications",
                "one": "Taking one high-risk medication",
                "two": "Taking two high-risk medications",
                "more": "Taking more than two high-risk medications"
            },
            "psychological": {
                "none": "None",
                "mild": "Mild",
                "moderate": "Moderate",
                "severe": "Severe"
            },
            "cognitive": {
                "intact": "Intact",
                "mild": "Mild",
                "moderate": "Moderate",
                "severe": "Severe"
            }
        },
        "part2": {
            "vision": "Vision",
            "mobility": "Mobility",
            "transfers": "Transfers",
            "behaviours": "Behaviours",
            "adl": "Activities of Daily Living (A.D.L's)",
            "equipment": "Unsafe use of equipment",
            "footwear": "Footwear/Clothing",
            "environment": "Environment",
            "nutrition": "Nutrition",
            "continence": "Continence",
            "other": "Other"
        }
    }

def format_assessment(raw_assessment):
    labels = get_option_labels()
    part1 = raw_assessment.get("part1", {})
    part2 = raw_assessment.get("part2", {})
    formatted = {
        "part1": {},
        "part2": {}
    }
    for key, value in part1.items():
        label = labels["part1"].get(key, {}).get(value, value)
        formatted["part1"][key] = {
            "value": value,
            "label": label
        }
    for key, value in part2.items():
        label = labels["part2"].get(key, key)
        formatted["part2"][key] = {
            "value": value,
            "label": label
        }
    return formatted

def get_patient_full_info(patient_id, access_token):
    fhir_client = FHIRClient()
    patient = fhir_client.get_patient(patient_id, access_token)
    conditions = fhir_client.get_patient_conditions(patient_id, access_token)
    medications = fhir_client.get_patient_medications(patient_id, access_token)
    observations = fhir_client.get_patient_observations(patient_id, access_token)
    immunizations = fhir_client.get_patient_immunizations(patient_id, access_token)

    # Format name
    name_obj = patient.get("name", [{}])[0]
    full_name = " ".join(name_obj.get("given", [])) + " " + name_obj.get("family", "")

    # Format conditions
    med_history = [
        f"{c['code']['coding'][0]['display']} ({c.get('clinicalStatus', {}).get('coding', [{}])[0].get('code', '')})"
        for c in conditions if c.get("code") and c["code"].get("coding")
    ]

    # Format medications
    meds = [m.get("medicationCodeableConcept", {}).get("text", "") for m in medications if m.get("medicationCodeableConcept")]

    # Format observations (AMTS and others)
    amts_score = None
    obs_list = []
    for obs in observations:
        code = obs.get("code", {}).get("coding", [{}])[0].get("code", "")
        display = obs.get("code", {}).get("coding", [{}])[0].get("display", "")
        if code == "72133-2" or "Abbreviated Mental Test" in display:
            amts_score = obs.get("valueInteger", None)
            obs_list.append(f"Abbreviated Mental Test Score: {amts_score}")
        else:
            val = obs.get("valueInteger", obs.get("valueString", ""))
            obs_list.append(f"{display}: {val}")

    # Format immunizations
    immun_list = []
    for imm in immunizations:
        vaccine = imm.get("vaccineCode", {}).get("text", "")
        date = imm.get("occurrenceDateTime", "")
        if vaccine and date:
            immun_list.append(f"{vaccine} on {date}")

    return {
        "id": patient.get("id"),
        "name": full_name.strip(),
        "birthDate": patient.get("birthDate"),
        "gender": patient.get("gender"),
        "hospital_id": patient.get("identifier", [{}])[0].get("value", ""),
        "medical_history": med_history,
        "medications": meds,
        "observations": obs_list,
        "amts_score": amts_score,
        "immunizations": immun_list
    }

@assessment_bp.route('/draft', methods=['GET'])
def get_assessment_draft():
    draft = session.get('current_assessment')
    if draft:
        return jsonify({"part1": draft.get("part1", {}), "part2": draft.get("part2", {})})
    return jsonify({"part1": {}, "part2": {}})

@assessment_bp.route('/draft', methods=['POST'])
def save_assessment_draft():
    data = request.json
    session['current_assessment'] = data
    return jsonify({"message": "Draft saved"})

@assessment_bp.route('/submit', methods=['POST'])
def submit_assessment():
    data = request.json
    auth = get_auth_from_request()
    
    if not auth:
        return jsonify({"error": "Not authenticated"}), 401
    
    patient_id = auth.get('patient_id')
    access_token = auth.get('access_token')
    
    if not patient_id or not access_token:
        return jsonify({"error": "No patient selected or not authenticated"}), 400

    patient_info = get_patient_full_info(patient_id, access_token)
    formatted_assessment = format_assessment(data)

    # store risk score and level from frontend
    formatted_assessment["risk_score"] = data.get("risk_score")
    formatted_assessment["risk_level"] = data.get("risk_level")

    # Ensure the directory exists
    os.makedirs(os.path.dirname(ASSESSMENT_FILE), exist_ok=True)

    # Load all assessments
    all_data = {}
    if os.path.exists(ASSESSMENT_FILE) and os.path.getsize(ASSESSMENT_FILE) > 0:
        try:
            with open(ASSESSMENT_FILE, "r") as f:
                all_data = json.load(f)
        except (json.JSONDecodeError, ValueError):
            # If file is corrupted, start fresh
            all_data = {}
    
    # Add or update patient entry
    if patient_id not in all_data:
        all_data[patient_id] = {
            "patient_info": patient_info,
            "assessments": []
        }
    all_data[patient_id]["patient_info"] = patient_info  # Always update with latest info
    all_data[patient_id]["assessments"].append(formatted_assessment)

    # Save back to file
    with open(ASSESSMENT_FILE, "w") as f:
        json.dump(all_data, f, indent=2)

    session['assessment_result'] = formatted_assessment
    return jsonify({"message": "Assessment submitted"})

@assessment_bp.route('/result', methods=['GET'])
def get_assessment_result():
    auth = get_auth_from_request()
    
    if not auth:
        return jsonify({"error": "Not authenticated"}), 401
    
    patient_id = auth.get('patient_id')
    if not patient_id:
        return jsonify({"error": "No patient selected"}), 400
    
    if os.path.exists(ASSESSMENT_FILE) and os.path.getsize(ASSESSMENT_FILE) > 0:
        try:
            with open(ASSESSMENT_FILE, "r") as f:
                all_data = json.load(f)
            patient_data = all_data.get(patient_id)
            if patient_data:
                return jsonify(patient_data)
            else:
                return jsonify({"error": "No assessment result found for this patient"}), 404
        except (json.JSONDecodeError, ValueError):
            return jsonify({"error": "Assessment data file is corrupted"}), 500
    
    return jsonify({"error": "No assessment data found"}), 404

@assessment_bp.route('/save', methods=['POST'])
def save_to_patient_record():
    # Here you would call FHIR client to save to EHR
    return jsonify({"message": "Assessment saved to patient record"})