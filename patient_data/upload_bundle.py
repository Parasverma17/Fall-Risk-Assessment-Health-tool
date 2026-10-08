import json
import requests
import sys
from pathlib import Path

FHIR_BASE_URL = "https://launch.smarthealthit.org/v/r4/fhir"

def upload_bundle(bundle_path):
    print(f"Reading bundle from: {bundle_path}")
    
    with open(bundle_path, 'r', encoding='utf-8') as f:
        bundle_data = json.load(f)
    
    print(f"Bundle type: {bundle_data.get('type')}")
    print(f"Number of entries: {len(bundle_data.get('entry', []))}")
    
    headers = {
        'Content-Type': 'application/fhir+json',
        'Accept': 'application/fhir+json'
    }
    
    print(f"\nUploading to: {FHIR_BASE_URL}")
    
    try:
        response = requests.post(
            FHIR_BASE_URL,
            json=bundle_data,
            headers=headers,
            timeout=60
        )
        
        print(f"\nResponse Status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            print("SUCCESS: Bundle uploaded successfully!")
            result = response.json()
            
            if result.get('entry'):
                print(f"\nCreated {len(result['entry'])} resources:")
                for entry in result['entry']:
                    if entry.get('response', {}).get('location'):
                        resource_location = entry['response']['location']
                        print(f"  - {resource_location}")
            
            patient_entries = [e for e in result.get('entry', []) 
                             if 'Patient' in e.get('response', {}).get('location', '')]
            
            if patient_entries:
                print("\nPatient IDs created:")
                for entry in patient_entries:
                    location = entry['response']['location']
                    patient_id = location.split('/')[1].split('/_')[0]
                    print(f"  - {patient_id}")
            
            return True
        else:
            print("FAILED: Bundle upload failed")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"ERROR: Request failed - {str(e)}")
        return False
    except Exception as e:
        print(f"ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    script_dir = Path(__file__).parent
    bundle_file = script_dir / "bundle.json"
    
    if not bundle_file.exists():
        print(f"ERROR: bundle.json not found at {bundle_file}")
        sys.exit(1)
    
    success = upload_bundle(bundle_file)
    sys.exit(0 if success else 1)
