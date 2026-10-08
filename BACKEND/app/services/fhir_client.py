import requests
from flask import current_app
from typing import Dict, List

class FHIRClient:
    def __init__(self):
        self.base_url = current_app.config['FHIR_BASE_URL'].rstrip('/')

    def _get_headers(self, access_token: str) -> Dict[str, str]:
        return {
            'Authorization': f'Bearer {access_token}',
            'Accept': 'application/fhir+json'
        }

    def get_patient(self, patient_id: str, access_token: str) -> Dict:
        url = f"{self.base_url}/Patient/{patient_id}"
        headers = self._get_headers(access_token)
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()

    def get_patient_conditions(self, patient_id: str, access_token: str) -> List[Dict]:
        url = f"{self.base_url}/Condition"
        headers = self._get_headers(access_token)
        params = {'patient': patient_id}
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        return [entry['resource'] for entry in data.get('entry', [])]

    def get_patient_medications(self, patient_id: str, access_token: str) -> List[Dict]:
        url = f"{self.base_url}/MedicationStatement"
        headers = self._get_headers(access_token)
        params = {'patient': patient_id}
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        return [entry['resource'] for entry in data.get('entry', [])]

    def get_patient_observations(self, patient_id: str, access_token: str) -> List[Dict]:
        url = f"{self.base_url}/Observation"
        headers = self._get_headers(access_token)
        params = {'patient': patient_id}
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        return [entry['resource'] for entry in data.get('entry', [])]

    def get_patient_immunizations(self, patient_id: str, access_token: str) -> List[Dict]:
        url = f"{self.base_url}/Immunization"
        headers = self._get_headers(access_token)
        params = {'patient': patient_id}
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        return [entry['resource'] for entry in data.get('entry', [])]

    def extract_patient_resources(self, patient_id: str, access_token: str) -> dict:
        """Fetch and return all relevant FHIR resources for the patient."""
        patient = self.get_patient(patient_id, access_token)
        conditions = self.get_patient_conditions(patient_id, access_token)
        medications = self.get_patient_medications(patient_id, access_token)
        observations = self.get_patient_observations(patient_id, access_token)
        immunizations = self.get_patient_immunizations(patient_id, access_token)
        return {
            "patient": patient,
            "conditions": conditions,
            "medications": medications,
            "observations": observations,
            "immunizations": immunizations
        }