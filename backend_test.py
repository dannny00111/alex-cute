#!/usr/bin/env python3
import requests
import json
import os
import sys
from datetime import datetime

# Get the backend URL from the frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.strip().split('=')[1].strip('"\'')
    except Exception as e:
        print(f"Error reading frontend .env file: {e}")
        sys.exit(1)

# Main test function
def run_tests():
    backend_url = get_backend_url()
    if not backend_url:
        print("ERROR: Could not find REACT_APP_BACKEND_URL in frontend/.env")
        sys.exit(1)
    
    api_url = f"{backend_url}/api"
    print(f"Testing backend API at: {api_url}")
    
    test_results = {
        "server_responding": False,
        "root_endpoint": False,
        "status_post": False,
        "status_get": False,
        "mongodb_connection": False
    }
    
    # Test 1: Check if server is responding
    try:
        response = requests.get(api_url, timeout=10)
        if response.status_code == 200:
            test_results["server_responding"] = True
            print("✅ Server is responding")
        else:
            print(f"❌ Server returned status code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Server connection error: {e}")
    
    if not test_results["server_responding"]:
        print("❌ Cannot continue testing as server is not responding")
        return test_results
    
    # Test 2: Test root endpoint
    try:
        response = requests.get(api_url, timeout=10)
        if response.status_code == 200 and response.json().get("message") == "Hello World":
            test_results["root_endpoint"] = True
            print("✅ Root endpoint working correctly")
        else:
            print(f"❌ Root endpoint test failed: {response.status_code}, {response.text}")
    except Exception as e:
        print(f"❌ Root endpoint test error: {e}")
    
    # Test 3: Test POST /status endpoint
    try:
        client_name = f"test_client_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
        response = requests.post(
            f"{api_url}/status", 
            json={"client_name": client_name},
            timeout=10
        )
        
        if response.status_code == 200 and response.json().get("client_name") == client_name:
            test_results["status_post"] = True
            print(f"✅ POST /status endpoint working correctly")
            status_id = response.json().get("id")
            print(f"   Created status check with ID: {status_id}")
        else:
            print(f"❌ POST /status test failed: {response.status_code}, {response.text}")
    except Exception as e:
        print(f"❌ POST /status test error: {e}")
    
    # Test 4: Test GET /status endpoint
    try:
        response = requests.get(f"{api_url}/status", timeout=10)
        if response.status_code == 200 and isinstance(response.json(), list):
            test_results["status_get"] = True
            print(f"✅ GET /status endpoint working correctly")
            print(f"   Retrieved {len(response.json())} status checks")
            
            # If we successfully posted a status check, this also confirms MongoDB is working
            if test_results["status_post"]:
                test_results["mongodb_connection"] = True
                print("✅ MongoDB connection is working correctly")
        else:
            print(f"❌ GET /status test failed: {response.status_code}, {response.text}")
    except Exception as e:
        print(f"❌ GET /status test error: {e}")
    
    # Print summary
    print("\n=== TEST SUMMARY ===")
    for test, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test}")
    
    return test_results

if __name__ == "__main__":
    run_tests()