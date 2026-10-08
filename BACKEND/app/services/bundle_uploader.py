import json
import requests
import os
from pathlib import Path

FHIR_BASE_URL = "https://launch.smarthealthit.org/v/r4/fhir"

def upload_bundle_to_fhir():
    backend_dir = Path(__file__).parent.parent.parent
    project_root = backend_dir.parent
    bundle_path = project_root / "patient_data" / "bundle.json"
    
    if not bundle_path.exists():
        print(f"Bundle file not found at: {bundle_path}")
        return False
    
    print("\n" + "="*60)
    print("UPLOADING PATIENT BUNDLE TO FHIR SERVER")
    print("="*60)
    print(f"Reading bundle from: {bundle_path}")
    
    try:
        with open(bundle_path, 'r', encoding='utf-8') as f:
            bundle_data = json.load(f)
        
        print(f"Bundle type: {bundle_data.get('type')}")
        print(f"Number of entries: {len(bundle_data.get('entry', []))}")
        
        headers = {
            'Content-Type': 'application/fhir+json',
            'Accept': 'application/fhir+json'
        }
        
        print(f"Uploading to: {FHIR_BASE_URL}")
        
        response = requests.post(
            FHIR_BASE_URL,
            json=bundle_data,
            headers=headers,
            timeout=60
        )
        
        if response.status_code in [200, 201]:
            print("\nSUCCESS: Bundle uploaded successfully!")
            result = response.json()
            
            patient_entries = [e for e in result.get('entry', []) 
                             if 'Patient' in e.get('response', {}).get('location', '')]
            
            if patient_entries:
                print(f"\nCreated {len(patient_entries)} patients:")
                for entry in patient_entries:
                    location = entry['response']['location']
                    patient_id = location.split('/')[1].split('/_')[0]
                    print(f"  - Patient ID: {patient_id}")
            
            print("="*60 + "\n")
            return True
        else:
            print(f"\nWARNING: Bundle upload returned status {response.status_code}")
            print(f"Response: {response.text[:200]}")
            print("="*60 + "\n")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"\nWARNING: Could not upload bundle - {str(e)}")
        print("Continuing with backend startup...")
        print("="*60 + "\n")
        return False
    except Exception as e:
        print(f"\nWARNING: Error uploading bundle - {str(e)}")
        print("Continuing with backend startup...")
        print("="*60 + "\n")
        return False
